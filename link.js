// Link checker: reads a pasted URL as text and flags scam patterns. Never opens or fetches it.

function registrableDomain(host) {
  const parts = host.split('.');
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join('.');
  const take = CONFIG.link.twoPartSuffixes.includes(lastTwo) ? 3 : 2;
  return parts.slice(-take).join('.');
}

// "amaz0n" → "amazon", "paypa1" → "paypal": digits scammers use in place of letters.
function undigit(text) {
  return text.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/5/g, 's').replace(/4/g, 'a');
}

// RFC 3492 decoder: "xn--mazon-3ve" → "аmazon". Browsers store non-English host letters this way.
function punycodeDecode(input) {
  const base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700;
  const adapt = (delta, count, first) => {
    delta = first ? Math.floor(delta / damp) : delta >> 1;
    delta += Math.floor(delta / count);
    let k = 0;
    while (delta > ((base - tMin) * tMax) >> 1) { delta = Math.floor(delta / (base - tMin)); k += base; }
    return k + Math.floor(((base - tMin + 1) * delta) / (delta + skew));
  };
  const digit = (c) => (c >= 48 && c < 58 ? c - 22 : c >= 65 && c < 91 ? c - 65 : c >= 97 && c < 123 ? c - 97 : base);
  const out = [];
  let n = 128, i = 0, bias = 72;
  const b = Math.max(0, input.lastIndexOf('-'));
  for (let j = 0; j < b; j++) out.push(input.charCodeAt(j));
  for (let idx = b > 0 ? b + 1 : 0; idx < input.length;) {
    const oldi = i;
    let w = 1;
    for (let k = base; ; k += base) {
      if (idx >= input.length) throw new Error('bad punycode');
      const d = digit(input.charCodeAt(idx++));
      if (d >= base) throw new Error('bad punycode');
      i += d * w;
      const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
      if (d < t) break;
      w *= base - t;
    }
    bias = adapt(i - oldi, out.length + 1, oldi === 0);
    n += Math.floor(i / (out.length + 1));
    i %= out.length + 1;
    out.splice(i++, 0, n);
  }
  return String.fromCodePoint(...out);
}

function unicodeHost(host) {
  return host.split('.').map((label) => {
    if (!label.startsWith('xn--')) return label;
    try { return punycodeDecode(label.slice(4)); } catch (e) { return label; }
  }).join('.');
}

function scriptOf(ch) {
  if (/\p{Script=Cyrillic}/u.test(ch)) return 'cyrillic';
  if (/\p{Script=Greek}/u.test(ch)) return 'greek';
  if (/\p{Script=Armenian}/u.test(ch)) return 'armenian';
  if (/\p{Script=Latin}/u.test(ch)) return 'accented';
  return 'other';
}

// What the host looks like to the eye, in plain English letters: "аmazon.com" → "amazon.com".
function skeleton(text) {
  const map = CONFIG.link.confusables;
  return [...text.normalize('NFD').replace(/\p{M}/gu, '')].map((c) => map[c] || c).join('').toLowerCase();
}

function parseLink(raw) {
  let text = String(raw || '').trim();
  if (!text) return null;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) text = `https://${text}`;
  try {
    const url = new URL(text);
    if (!/^https?:$/.test(url.protocol) || !url.hostname.includes('.')) return null;
    return { url, raw: text };
  } catch (e) {
    return null;
  }
}

// Returns { verdict: 'danger'|'warn'|'official'|'ok', domain, findings: [{ level, key, args }] }.
function analyzeLink(raw) {
  const parsed = parseLink(raw);
  if (!parsed) return null;
  const { url } = parsed;
  const cfg = CONFIG.link;
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  const findings = [];
  const add = (level, key, ...args) => findings.push({ level, key, args });
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[');
  const domain = isIp ? host : registrableDomain(host);
  const label = domain.split('.')[0];
  const tld = host.split('.').pop();

  if (isIp) add('danger', 'ip');
  if (/^https?:\/\/[^/]*@/i.test(parsed.raw)) add('danger', 'at');

  // Letters from another alphabet that look like English ones (homograph attack).
  const shown = unicodeHost(host);
  const foreign = [...new Set([...shown].filter((c) => c.charCodeAt(0) > 127 && c !== '.'))];
  const looksLike = foreign.length ? skeleton(shown) : null;
  if (foreign.length) {
    const hasLatin = /[a-z]/.test(shown.replace(/xn--/g, ''));
    const mimicsLatin = /^[a-z0-9.-]+$/.test(looksLike);
    if (hasLatin || mimicsLatin) {
      const t = (k) => ({ ar: CONFIG.strings.ar.link.scripts[k], en: CONFIG.strings.en.link.scripts[k] });
      // Accents are normal in some languages (münchen.de), so alone they only warn; other alphabets mixed in are danger.
      foreign.slice(0, 3).forEach((c) => {
        const script = scriptOf(c);
        add(script === 'accented' ? 'warn' : 'danger', 'foreignChar', c, t(script));
      });
    }
  } else if (host.split('.').some((p) => p.startsWith('xn--'))) {
    add('danger', 'punycode');
  }

  // Brand checks: official domain, impersonation, digit look-alikes.
  let official = null;
  if (!isIp) {
    for (const [id, brand] of Object.entries(cfg.brands)) {
      if (brand.domains.includes(domain)) { official = brand; break; }
    }
    // A look-alike of an official domain: the strongest homograph signal.
    if (!official && looksLike) {
      const fakeOf = Object.values(cfg.brands).find((b) => b.domains.includes(registrableDomain(looksLike)));
      if (fakeOf) add('danger', 'homograph', registrableDomain(looksLike));
    }
    if (!official && !findings.some((f) => f.key === 'homograph')) {
      const plain = (looksLike || host).replace(/[^a-z0-9.-]/g, '');
      const normalized = undigit(plain);
      for (const [id, brand] of Object.entries(cfg.brands)) {
        const words = brand.keywords || [id];
        // Short keywords like "stc" must stand alone between separators to avoid false hits.
        const hit = (text) => words.some((w) => (w.length <= 3 || brand.strict
          ? new RegExp(`(^|[.-])${w}([.-]|$)`).test(text)
          : text.includes(w)));
        if (hit(plain)) {
          add('danger', 'impersonation', brand.name, brand.domains[0]);
          break;
        }
        if (hit(normalized)) {
          add('danger', 'impersonation', brand.name, brand.domains[0]);
          add('danger', 'lookalike');
          break;
        }
      }
    }
  }

  if (cfg.shorteners.includes(host) || cfg.shorteners.includes(domain)) add('warn', 'shortener');
  if (url.protocol === 'http:') add('warn', 'http');
  if (!isIp && cfg.riskyTlds.includes(tld)) add('warn', 'tld', tld);
  if (!isIp && host.split('.').length - domain.split('.').length >= cfg.maxSubdomains) add('warn', 'subdomains');
  if (url.port && !['80', '443'].includes(url.port)) add('warn', 'port');
  if (!official && !label.startsWith('xn--') && (label.match(/-/g) || []).length >= 2) add('warn', 'hyphens');
  if (!official) {
    const haystack = (host + url.pathname).toLowerCase();
    const word = cfg.bait.find((w) => haystack.includes(w));
    if (word) add('warn', 'bait', word);
  }

  const danger = findings.some((f) => f.level === 'danger');
  const warn = findings.some((f) => f.level === 'warn');
  let verdict = danger ? 'danger' : warn ? 'warn' : official ? 'official' : 'ok';
  if (official && !danger) findings.unshift({ level: 'good', key: 'official', args: [official.name] });
  if (official && !danger && url.protocol === 'https:') verdict = 'official';
  return { verdict, domain, shown: looksLike ? shown : null, findings };
}

function createLinkChecker(getLang) {
  const $ = (id) => document.getElementById(id);
  let last = null;

  const s = () => CONFIG.strings[getLang()].link;

  function render() {
    const t = s();
    $('linkInput').placeholder = t.placeholder;
    $('linkExamples').replaceChildren(...CONFIG.link.examples.map((ex) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.dir = 'ltr';
      b.textContent = ex;
      b.addEventListener('click', () => { $('linkInput').value = ex; check(); });
      return b;
    }));
    if (last === null) return;
    const box = $('linkResult');
    box.hidden = false;
    if (last === 'empty' || last === 'invalid') {
      box.dataset.verdict = 'warn';
      $('linkVerdictText').textContent = t[last];
      $('linkDomain').parentElement.hidden = true;
      $('linkFindings').replaceChildren();
      $('linkHint').hidden = true;
      return;
    }
    const lang = getLang();
    box.dataset.verdict = last.verdict;
    $('linkVerdictText').textContent = t.verdicts[last.verdict];
    $('linkDomain').parentElement.hidden = false;
    $('linkDomain').textContent = last.domain;
    $('linkFindings').replaceChildren(...last.findings.map((f) => {
      const li = document.createElement('li');
      li.className = f.level;
      const args = f.args.map((a) => (a && typeof a === 'object' ? a[lang] : a));
      const msg = t.findings[f.key];
      li.textContent = typeof msg === 'function' ? msg(...args) : msg;
      return li;
    }));
    $('linkHint').textContent = t.okHint;
    $('linkHint').hidden = last.verdict !== 'ok';
  }

  function check() {
    const value = $('linkInput').value;
    last = !value.trim() ? 'empty' : analyzeLink(value) || 'invalid';
    render();
  }

  $('linkForm').addEventListener('submit', (e) => {
    e.preventDefault();
    check();
  });

  return { render };
}
