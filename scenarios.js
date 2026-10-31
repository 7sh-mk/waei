// Messages for "Real or scam?". Links are shown as text only and never opened.
// fake: true = scam. Real links use the official domains checked in CONFIG.link.brands.
const SCENARIOS = [
  {
    fake: false, channel: 'sms',
    sender: { ar: 'Absher', en: 'Absher' },
    text: {
      ar: 'عزيزي المستفيد، تم تجديد رخصة القيادة بنجاح. يمكنك الاطلاع على التفاصيل عبر أبشر.',
      en: 'Dear beneficiary, your driving licence was renewed successfully. See the details on Absher.',
    },
    link: 'https://www.absher.sa',
    clues: {
      ar: ['الرابط على النطاق الرسمي absher.sa', 'لا يطلب منك بيانات ولا دفعًا'],
      en: ['The link is on the official domain absher.sa', 'It asks for no data and no payment'],
    },
  },
  {
    fake: true, channel: 'sms',
    sender: { ar: 'Absher-Info', en: 'Absher-Info' },
    text: {
      ar: 'تم إيقاف خدماتك في أبشر لعدم تحديث بياناتك. حدّثها خلال 24 ساعة لتجنب الغرامة.',
      en: 'Your Absher services were suspended because your data is outdated. Update within 24 hours to avoid a fine.',
    },
    link: 'absher-sa.com/update',
    clues: {
      ar: ['النطاق absher-sa.com وليس absher.sa', 'يستعجلك بمهلة وتهديد بغرامة'],
      en: ['The domain is absher-sa.com, not absher.sa', 'It rushes you with a deadline and a fine'],
    },
  },
  {
    fake: false, channel: 'sms',
    sender: { ar: 'SPL', en: 'SPL' },
    text: {
      ar: 'شحنتك رقم RR482913SA وصلت إلى صندوقك البريدي وهي جاهزة للاستلام.',
      en: 'Your shipment RR482913SA has arrived at your mailbox and is ready for pickup.',
    },
    link: 'https://splonline.com.sa',
    clues: {
      ar: ['الرابط على النطاق الرسمي splonline.com.sa', 'لا يطلب أي رسوم'],
      en: ['The link is on the official domain splonline.com.sa', 'It asks for no fee'],
    },
  },
  {
    fake: true, channel: 'sms',
    sender: { ar: 'SaudiPost', en: 'SaudiPost' },
    text: {
      ar: 'شحنتك معلّقة بسبب نقص في العنوان. ادفع 5.75 ريال رسوم إعادة التوصيل لاستلامها.',
      en: 'Your shipment is on hold due to an incomplete address. Pay SAR 5.75 redelivery fee to receive it.',
    },
    link: 'spl-sa.delivery-fee.com/pay',
    clues: {
      ar: ['النطاق الحقيقي delivery-fee.com وليس سبل', 'مبلغ صغير ليأخذ بيانات بطاقتك كاملة'],
      en: ['The real domain is delivery-fee.com, not SPL', 'A tiny fee to capture your full card details'],
    },
  },
  {
    fake: false, channel: 'sms',
    sender: { ar: 'AlRajhiBank', en: 'AlRajhiBank' },
    text: {
      ar: 'رمز التحقق: 4821 لعملية شراء من noon بمبلغ 249 ريال. لا تشارك الرمز مع أي أحد.',
      en: 'Verification code: 4821 for a SAR 249 purchase at noon. Do not share this code with anyone.',
    },
    link: '',
    clues: {
      ar: ['لا رابط ولا طلب، فقط رمز لعملية قمت بها', 'البنك نفسه يحذرك من مشاركة الرمز'],
      en: ['No link and no request, just a code for your own purchase', 'The bank itself warns you not to share it'],
    },
  },
  {
    fake: true, channel: 'whatsapp',
    sender: { ar: 'خدمة عملاء الراجحي', en: 'Al Rajhi Customer Care' },
    text: {
      ar: 'سيتم تعليق بطاقتك اليوم. سيصلك رمز الآن، أرسله لي لنحدّث بياناتك ونلغي التعليق.',
      en: 'Your card will be suspended today. You will get a code now; send it to me so we can update your data.',
    },
    link: '',
    clues: {
      ar: ['البنك لا يطلب رمز التحقق أبدًا', 'البنوك لا تراسلك من رقم واتساب شخصي'],
      en: ['Banks never ask for your verification code', 'Banks do not message you from a personal WhatsApp'],
    },
  },
  {
    fake: false, channel: 'sms',
    sender: { ar: 'Nafath', en: 'Nafath' },
    text: {
      ar: 'لديك طلب تسجيل دخول عبر نفاذ. افتح تطبيق نفاذ واختر الرقم 38. إن لم تطلب ذلك فتجاهل الرسالة.',
      en: 'You have a Nafath sign-in request. Open the Nafath app and choose number 38. If it was not you, ignore this.',
    },
    link: '',
    clues: {
      ar: ['يوجّهك للتطبيق الرسمي وليس لرابط', 'يقول لك: تجاهل إن لم تطلب'],
      en: ['It sends you to the official app, not a link', 'It tells you to ignore it if it was not you'],
    },
  },
  {
    fake: true, channel: 'sms',
    sender: { ar: 'Nafath-SA', en: 'Nafath-SA' },
    text: {
      ar: 'يرجى تأكيد هويتك في نفاذ لتجنب إيقاف حسابك نهائيًا.',
      en: 'Please confirm your identity on Nafath to avoid permanent account suspension.',
    },
    link: 'nafath.sa-verify.com',
    clues: {
      ar: ['النطاق الحقيقي sa-verify.com، وكلمة nafath.sa مجرد تمويه في البداية', 'تهديد بإيقاف الحساب'],
      en: ['The real domain is sa-verify.com; "nafath.sa" at the start is a disguise', 'It threatens to close your account'],
    },
  },
  {
    fake: false, channel: 'sms',
    sender: { ar: 'STC', en: 'STC' },
    text: {
      ar: 'تم سداد فاتورتك بمبلغ 230 ريال. شكرًا لك. للاطلاع على تفاصيل الفاتورة:',
      en: 'Your bill of SAR 230 has been paid. Thank you. For bill details:',
    },
    link: 'https://www.stc.com.sa',
    clues: {
      ar: ['الرابط على النطاق الرسمي stc.com.sa', 'إشعار بعملية تمت، بلا طلب'],
      en: ['The link is on the official domain stc.com.sa', 'A notice of something done, no request'],
    },
  },
  {
    fake: true, channel: 'sms',
    sender: { ar: 'STC-Gift', en: 'STC-Gift' },
    text: {
      ar: 'مبروك! ربحت آيفون 17 في سحب اليوم الوطني. استلم جائزتك قبل نهاية اليوم.',
      en: 'Congratulations! You won an iPhone 17 in the National Day draw. Claim it before the end of today.',
    },
    link: 'stc-gift.top/claim',
    clues: {
      ar: ['جائزة لم تشارك فيها', 'النطاق stc-gift.top وليس stc.com.sa، وامتداد .top شائع في الاحتيال'],
      en: ['A prize for a draw you never entered', 'The domain is stc-gift.top, not stc.com.sa; .top is common in scams'],
    },
  },
  {
    fake: true, channel: 'sms',
    sender: { ar: 'ZATCA', en: 'ZATCA' },
    text: {
      ar: 'لديك مبلغ مسترد قدره 1,240 ريال من هيئة الزكاة. أدخل بيانات بطاقتك لاستلامه.',
      en: 'You have a SAR 1,240 refund from ZATCA. Enter your card details to receive it.',
    },
    link: 'zatca-refund.com',
    clues: {
      ar: ['الجهات الحكومية لا تطلب بيانات بطاقتك برسالة', 'النطاق الرسمي zatca.gov.sa'],
      en: ['Government bodies never ask for card details by text', 'The official domain is zatca.gov.sa'],
    },
  },
  {
    fake: false, channel: 'sms',
    sender: { ar: 'Amazon', en: 'Amazon' },
    text: {
      ar: 'تم شحن طلبك رقم 402-7731 وسيصل يوم الخميس. تتبّع شحنتك:',
      en: 'Your order 402-7731 has shipped and will arrive Thursday. Track it:',
    },
    link: 'https://www.amazon.sa/orders',
    clues: {
      ar: ['الرابط على النطاق الرسمي amazon.sa', 'إشعار عن طلب قمت به، بلا دفع'],
      en: ['The link is on the official domain amazon.sa', 'A notice about your own order, no payment'],
    },
  },
  {
    fake: true, channel: 'sms',
    sender: { ar: 'Amazon', en: 'Amazon' },
    text: {
      ar: 'رصدنا عملية دخول مشبوهة إلى حسابك. تحقق الآن وإلا سيُغلق الحساب.',
      en: 'We detected a suspicious sign-in to your account. Verify now or it will be closed.',
    },
    link: 'amaz0n-sa.com/login',
    clues: {
      ar: ['حرف o مستبدل بالرقم 0 في amaz0n', 'تخويف واستعجال'],
      en: ['The letter o is replaced by the digit 0 in amaz0n', 'Fear and urgency'],
    },
  },
  {
    fake: true, channel: 'whatsapp',
    sender: { ar: '+966 55 *** 4410', en: '+966 55 *** 4410' },
    text: {
      ar: 'يمه هذا رقمي الجديد، جوالي خرب. أحتاج أحوّل مبلغ ضروري الحين وما أقدر أدخل حسابي، تحوّلين لي؟',
      en: "Mum, this is my new number, my phone broke. I need to make an urgent transfer and can't access my account. Can you send it?",
    },
    link: '',
    clues: {
      ar: ['رقم جديد غير محفوظ يدّعي أنه قريبك', 'طلب تحويل مستعجل. اتصل على رقمه القديم أولًا'],
      en: ['An unknown number claiming to be family', 'An urgent transfer request. Call their old number first'],
    },
  },
  {
    fake: true, channel: 'sms',
    sender: { ar: 'Tawakkalna', en: 'Tawakkalna' },
    text: {
      ar: 'تحديث تطبيق توكلنا أصبح إلزاميًا. نزّل النسخة الجديدة من الرابط:',
      en: 'Updating Tawakkalna is now mandatory. Download the new version from this link:',
    },
    link: 'bit.ly/3xTwk9',
    clues: {
      ar: ['التطبيقات تُحدَّث من المتجر الرسمي فقط', 'رابط مختصر يخفي وجهته'],
      en: ['Apps update only from the official store', 'A short link that hides where it goes'],
    },
  },
];
