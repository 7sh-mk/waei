// Page flow: language, hash routing between the home screen and the two tools.
(function () {
  const $ = (id) => document.getElementById(id);
  const VIEWS = ['home', 'game', 'link'];
  let lang = CONFIG.defaultLang;

  const getLang = () => lang;
  const strings = () => CONFIG.strings[lang];
  // "tools.game.name" → strings().tools.game.name
  const lookup = (path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), strings());

  const game = createGame(getLang);
  const linkTool = createLinkChecker(getLang);

  function applyLang() {
    const s = strings();
    document.documentElement.lang = lang;
    document.documentElement.dir = s.dir;
    document.querySelectorAll('[data-i18n]').forEach((n) => {
      const value = lookup(n.dataset.i18n);
      if (typeof value === 'string') n.textContent = value;
    });
    document.querySelectorAll('.lang button').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    updateTitle();
    game.render();
    linkTool.render();
  }

  function currentView() {
    const name = location.hash.replace('#', '');
    return VIEWS.includes(name) ? name : 'home';
  }

  function updateTitle() {
    const s = strings();
    const view = currentView();
    document.title = view === 'home' ? s.title : `${s.tools[view].name} · ${s.title}`;
  }

  function route() {
    const view = currentView();
    document.body.dataset.view = view;
    document.querySelectorAll('.view').forEach((v) => { v.hidden = v.dataset.name !== view; });
    // Coming back to the game after a finished round starts a fresh one.
    if (view === 'game' && game.needsStart()) game.start();
    updateTitle();
    window.scrollTo(0, 0);
  }

  document.querySelectorAll('.lang button').forEach((b) => {
    b.addEventListener('click', () => {
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang;
      applyLang();
    });
  });
  window.addEventListener('hashchange', route);

  const links = { xLink: CONFIG.contact.x, linkedinLink: CONFIG.contact.linkedin, mailLink: CONFIG.contact.email && `mailto:${CONFIG.contact.email}` };
  for (const [id, href] of Object.entries(links)) {
    if (href) { $(id).href = href; $(id).hidden = false; }
  }

  applyLang();
  route();
})();
