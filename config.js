// Settings, rules and every UI string live here. Tune here, not inside the tools.
const CONFIG = {
  defaultLang: 'ar',

  game: {
    rounds: 10,
    swipeThreshold: 90,
    // Share of real messages per round. At 0.5, answering "scam" every time cannot pass.
    // Score out of `rounds` → result level.
    levels: { good: 9, mid: 6 },
    realShare: 0.5,
  },

  link: {
    // Official registrable domains per brand. A host that mentions the brand on any other domain is impersonation.
    // strict: the keyword must stand alone between dots/hyphens (so "pineapple" is not Apple).
    brands: {
      absher: { name: { ar: 'أبشر', en: 'Absher' }, domains: ['absher.sa'] },
      nafath: { name: { ar: 'نفاذ', en: 'Nafath' }, domains: ['nafath.sa', 'iam.gov.sa'] },
      najiz: { name: { ar: 'ناجز', en: 'Najiz' }, domains: ['najiz.sa'] },
      tawakkalna: { name: { ar: 'توكلنا', en: 'Tawakkalna' }, domains: ['sdaia.gov.sa'] },
      sehhaty: { name: { ar: 'صحتي', en: 'Sehhaty' }, domains: ['sehhaty.sa'] },
      zatca: { name: { ar: 'هيئة الزكاة', en: 'ZATCA' }, domains: ['zatca.gov.sa'] },
      spl: { name: { ar: 'سبل', en: 'SPL' }, domains: ['splonline.com.sa'], keywords: ['spl', 'saudipost', 'splonline'] },
      stc: { name: { ar: 'STC', en: 'STC' }, domains: ['stc.com.sa', 'stcpay.com.sa'], keywords: ['stc', 'stcpay'] },
      mobily: { name: { ar: 'موبايلي', en: 'Mobily' }, domains: ['mobily.com.sa'] },
      zain: { name: { ar: 'زين', en: 'Zain' }, domains: ['zain.com'] },
      alrajhi: { name: { ar: 'مصرف الراجحي', en: 'Al Rajhi Bank' }, domains: ['alrajhibank.com.sa'] },
      alahli: { name: { ar: 'البنك الأهلي', en: 'SNB (AlAhli)' }, domains: ['alahli.com'], keywords: ['alahli', 'snb'] },
      riyadbank: { name: { ar: 'بنك الرياض', en: 'Riyad Bank' }, domains: ['riyadbank.com'] },
      amazon: { name: { ar: 'أمازون', en: 'Amazon' }, domains: ['amazon.sa', 'amazon.com', 'amazon.ae'] },
      noon: { name: { ar: 'نون', en: 'noon' }, domains: ['noon.com'] },
      apple: { name: { ar: 'آبل', en: 'Apple' }, domains: ['apple.com', 'icloud.com'], keywords: ['apple', 'icloud'], strict: true },
      google: { name: { ar: 'جوجل', en: 'Google' }, domains: ['google.com', 'google.com.sa', 'youtube.com', 'googleusercontent.com', 'googleapis.com'], strict: true },
      microsoft: { name: { ar: 'مايكروسوفت', en: 'Microsoft' }, domains: ['microsoft.com', 'live.com', 'office.com'] },
      paypal: { name: { ar: 'باي بال', en: 'PayPal' }, domains: ['paypal.com'] },
      whatsapp: { name: { ar: 'واتساب', en: 'WhatsApp' }, domains: ['whatsapp.com'] },
      snapchat: { name: { ar: 'سناب شات', en: 'Snapchat' }, domains: ['snapchat.com'] },
      instagram: { name: { ar: 'إنستقرام', en: 'Instagram' }, domains: ['instagram.com'] },
    },
    shorteners: ['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'is.gd', 'rb.gy', 'shorturl.at', 'goo.gl', 'ow.ly', 's.id', 't.ly', 'tiny.cc', 'buff.ly'],
    riskyTlds: ['top', 'xyz', 'icu', 'click', 'live', 'shop', 'buzz', 'cfd', 'rest', 'sbs', 'cyou', 'monster', 'quest', 'zip', 'mov', 'online', 'site'],
    // Second-level suffixes, so "absher.com.sa" is read as one registrable domain.
    twoPartSuffixes: ['com.sa', 'gov.sa', 'edu.sa', 'org.sa', 'net.sa', 'med.sa', 'sch.sa', 'co.uk', 'com.eg', 'co.ae'],
    bait: ['login', 'verify', 'update', 'secure', 'account', 'gift', 'prize', 'reward', 'refund', 'bonus', 'confirm', 'wallet', 'unlock', 'support'],
    maxSubdomains: 3,
    // Letters from other alphabets that look like English ones. Accents (á, é…) are stripped separately.
    confusables: {
      // Cyrillic
      'а': 'a', 'в': 'b', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x', 'і': 'i', 'ј': 'j',
      'ѕ': 's', 'ԁ': 'd', 'һ': 'h', 'ӏ': 'l', 'ԛ': 'q', 'ԝ': 'w', 'ь': 'b', 'к': 'k', 'п': 'n', 'т': 't',
      // Greek
      'α': 'a', 'ε': 'e', 'ι': 'i', 'κ': 'k', 'ν': 'v', 'ο': 'o', 'ρ': 'p', 'τ': 't', 'υ': 'u', 'χ': 'x',
      // Armenian
      'օ': 'o', 'ս': 'u', 'հ': 'h', 'ո': 'n', 'ց': 'g', 'զ': 'q',
      // Latin look-alikes without a combining accent
      'ı': 'i', 'ł': 'l', 'ø': 'o', 'ß': 'b',
    },
    // The amazon example starts with a Cyrillic «а»: it looks identical on purpose.
    examples: ['https://www.absher.sa', 'аmazon.com', 'absher-sa.com/update', 'nafath.sa-verify.com', 'bit.ly/3xTwk9'],
  },

  strings: {
    ar: {
      dir: 'rtl',
      title: 'واعي',
      tagline: 'اكشف الرسائل والروابط الاحتيالية قبل أن تقع فيها',
      start: 'ابدأ التحدي',
      back: 'رجوع',
      tools: {
        game: { name: 'صادق ولا محتال؟', line: 'اختبر نفسك مع رسائل حقيقية ومزيفة' },
        link: { name: 'افحص الرابط', line: 'الصق أي رابط وصلك وتحقق منه بأمان' },
      },

      game: {
        intro: 'ستصلك 10 رسائل. قرّر: صادقة أم محتالة؟',
        sms: 'رسالة نصية',
        whatsapp: 'واتساب',
        real: 'صادقة',
        fake: 'محتالة',
        right: 'إجابة صحيحة',
        wrong: 'إجابة خاطئة',
        wasReal: 'هذه رسالة صادقة',
        wasFake: 'هذه رسالة محتالة',
        next: 'التالي',
        finish: 'النتيجة',
        progress: (i, n) => `${i} من ${n}`,
        levels: { good: 'واعي جدًا', mid: 'واعي، لكن انتبه', bad: 'هدف سهل للمحتالين' },
        resultLine: (s, n) => `أجبت إجابة صحيحة في ${s} من ${n}`,
        again: 'العب مرة أخرى',
        home: 'العودة للرئيسية',
      },

      link: {
        placeholder: 'الصق الرابط هنا',
        check: 'افحص',
        note: 'لا نفتح الرابط. نحلله فقط.',
        empty: 'الصق رابطًا أولًا',
        invalid: 'هذا لا يبدو رابطًا صحيحًا',
        domain: 'النطاق الحقيقي',
        verdicts: { danger: 'خطير، لا تفتحه', warn: 'مشبوه، تأكد قبل الفتح', official: 'رابط رسمي', ok: 'لا توجد علامات خطر واضحة' },
        okHint: 'لا يعني أنه آمن 100%. تأكد من المرسل دائمًا.',
        findings: {
          official: (b) => `النطاق الرسمي لـ ${b}`,
          impersonation: (b, d) => `يتظاهر بأنه ${b}، والنطاق الرسمي ${d}`,
          lookalike: 'يستبدل حروفًا بأرقام ليشبه اسمًا معروفًا',
          punycode: 'يستخدم حروفًا مزورة تشبه الحروف الإنجليزية',
          ip: 'يستخدم أرقام IP بدل اسم موقع',
          at: 'فيه علامة @ تخفي الوجهة الحقيقية',
          shortener: 'رابط مختصر يخفي وجهته الحقيقية',
          http: 'غير مشفّر (http بدل https)',
          tld: (t) => `امتداد .${t} شائع في مواقع الاحتيال`,
          subdomains: 'أجزاء كثيرة قبل اسم الموقع لإرباكك',
          bait: (w) => `كلمة «${w}» شائعة في روابط الاحتيال`,
          port: 'يستخدم منفذًا غير معتاد',
          hyphens: 'شرطات كثيرة في اسم الموقع',
          homograph: (d) => `يبدو مثل ${d} تمامًا، لكنه موقع آخر مكتوب بحروف لغة ثانية`,
          foreignChar: (c, script) => `الحرف «${c}» ليس إنجليزيًا، إنه من ${script}`,
        },
        scripts: {
          cyrillic: 'الأبجدية الروسية (السيريلية)', greek: 'الأبجدية اليونانية', armenian: 'الأبجدية الأرمنية',
          accented: 'حروف لاتينية بعلامات (مثل الإسبانية والفرنسية)', other: 'لغة أخرى',
        },
        examples: 'جرّب مثالًا:',
      },

      rights: 'جميع الحقوق محفوظة © شريفة الزبيدي',
      contact: 'للتواصل والاستفسارات والاقتراحات',
    },

    en: {
      dir: 'ltr',
      title: 'Waei',
      tagline: 'Spot scam messages and links before you fall for them',
      start: 'Start the challenge',
      back: 'Back',
      tools: {
        game: { name: 'Real or scam?', line: 'Test yourself with real and fake messages' },
        link: { name: 'Check a link', line: 'Paste any link you got and check it safely' },
      },

      game: {
        intro: "You'll get 10 messages. Decide: real or scam?",
        sms: 'Text message',
        whatsapp: 'WhatsApp',
        real: 'Real',
        fake: 'Scam',
        right: 'Correct',
        wrong: 'Wrong',
        wasReal: 'This message is real',
        wasFake: 'This message is a scam',
        next: 'Next',
        finish: 'See result',
        progress: (i, n) => `${i} of ${n}`,
        levels: { good: 'Very aware', mid: 'Aware, but careful', bad: 'Easy target for scammers' },
        resultLine: (s, n) => `You got ${s} of ${n} right`,
        again: 'Play again',
        home: 'Back to home',
      },

      link: {
        placeholder: 'Paste the link here',
        check: 'Check',
        note: "We don't open the link. We only analyze it.",
        empty: 'Paste a link first',
        invalid: "That doesn't look like a valid link",
        domain: 'Real domain',
        verdicts: { danger: "Dangerous, don't open it", warn: 'Suspicious, verify first', official: 'Official link', ok: 'No clear warning signs' },
        okHint: "That doesn't mean 100% safe. Always check the sender.",
        findings: {
          official: (b) => `Official domain of ${b}`,
          impersonation: (b, d) => `Pretends to be ${b}; the official domain is ${d}`,
          lookalike: 'Swaps letters for digits to look like a known name',
          punycode: 'Uses fake characters that look like English letters',
          ip: 'Uses an IP address instead of a site name',
          at: 'Has an @ sign that hides the real destination',
          shortener: 'Short link that hides where it goes',
          http: 'Not encrypted (http instead of https)',
          tld: (t) => `The .${t} ending is common on scam sites`,
          subdomains: 'Many parts before the site name to confuse you',
          bait: (w) => `The word "${w}" is common in scam links`,
          port: 'Uses an unusual port',
          hyphens: 'Many hyphens in the site name',
          homograph: (d) => `Looks exactly like ${d}, but it is another site written in another alphabet`,
          foreignChar: (c, script) => `The letter "${c}" is not English; it is from ${script}`,
        },
        scripts: {
          cyrillic: 'the Russian (Cyrillic) alphabet', greek: 'the Greek alphabet', armenian: 'the Armenian alphabet',
          accented: 'accented Latin letters (like Spanish or French)', other: 'another language',
        },
        examples: 'Try an example:',
      },

      rights: '© All rights reserved, Sharifa Alzubaidi',
      contact: 'Contact, questions and suggestions',
    },
  },

  // Footer contact links. An empty value hides its icon.
  contact: {
    x: 'https://x.com/7sh_mk',
    linkedin: 'https://www.linkedin.com/in/sharifa-alzubaidi-ksa/',
    email: 'sh.m.z1422@gmail.com',
  },
};
