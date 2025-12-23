/**
 * Generate all language versions of the website
 * Run with: node generate-languages.js
 */

const fs = require('fs');
const path = require('path');

// Read the English template
const templatePath = path.join(__dirname, 'en', 'index.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Read translations
const translationsPath = path.join(__dirname, 'js', 'translations.json');
const translationsData = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const languages = Object.keys(translationsData.languages);
const translations = translationsData.translations;

// Language-specific content replacements
const replacements = {
    'de': {
        title: 'TripPortier - Smarter Reisen',
        badge: 'KI-gestützte Reiseplattform',
        heroTitle1: 'Reise um die Welt',
        heroTitle2: 'wie ein',
        typingWords: "['Profi', 'Einheimischer', 'VIP', 'Entdecker', 'Abenteurer']",
        heroSubtitle: 'eSIM-Daten. Flughafentransfers. Flugverfolgung. KI-Planung. Alles was du brauchst — eine App.',
        airportTransfers: 'Flughafentransfers',
        airportTransfersDesc: 'Privatwagen & Shuttles weltweit',
        asiaTransport: 'Asien Transport',
        asiaTransportDesc: 'Züge, Busse & Fähren in ganz Asien',
        downloadApp: 'App herunterladen',
        downloadFree: 'Kostenlos im App Store herunterladen',
        androidSoon: 'Android kommt bald',
        float1: 'KI-Reiseplan bereit',
        float2: '200+ Länder',
        float3: 'Das Boarding für Ihren Flug beginnt jetzt',
        socialTitle: 'Von Reisenden weltweit geliebt',
        featuresTitle: 'Alles für Ihre Reise',
        featuresSubtitle: 'Von der Planung über das Packen bis zur Buchung - TripPortier erledigt alles mit leistungsstarker KI-Unterstützung.',
        ctaTitle: 'Starten Sie Ihr nächstes Abenteuer',
        ctaSubtitle: 'Buchen Sie Transfers, planen Sie mit KI und reisen Sie smarter mit TripPortier.',
        downloadFreeCta: 'Kostenlos laden',
        bookTransfer: 'Transfer buchen',
        footerTagline: 'Ihr smarter Reisebegleiter für stressfreie Trips.',
        langTitle: 'Verfügbar in 18 Sprachen',
        signIn: 'Anmelden'
    },
    'fr': {
        title: 'TripPortier - Voyagez Plus Intelligent',
        badge: 'Plateforme de voyage alimentée par l\'IA',
        heroTitle1: 'Parcourez le monde',
        heroTitle2: 'comme un',
        typingWords: "['Pro', 'Local', 'VIP', 'Explorateur', 'Aventurier']",
        heroSubtitle: 'Données eSIM. Transferts aéroport. Suivi de vol. Planification IA. Tout ce qu\'il vous faut — une app.',
        airportTransfers: 'Transferts Aéroport',
        airportTransfersDesc: 'Voitures privées & navettes dans le monde entier',
        asiaTransport: 'Transport Asie',
        asiaTransportDesc: 'Trains, bus & ferries à travers l\'Asie',
        downloadApp: 'Télécharger l\'App',
        downloadFree: 'Téléchargez gratuitement sur l\'App Store',
        androidSoon: 'Android bientôt disponible',
        float1: 'Itinéraire IA prêt',
        float2: '200+ Pays',
        float3: 'L\'embarquement pour votre vol commence maintenant',
        socialTitle: 'Adoré par les voyageurs du monde entier',
        featuresTitle: 'Tout pour votre voyage',
        featuresSubtitle: 'De la planification à l\'emballage en passant par la réservation - TripPortier gère tout avec une assistance IA puissante.',
        ctaTitle: 'Commencez votre prochaine aventure',
        ctaSubtitle: 'Réservez des transferts, planifiez avec l\'IA et voyagez plus intelligent avec TripPortier.',
        downloadFreeCta: 'Télécharger Gratuit',
        bookTransfer: 'Réserver un Transfert',
        footerTagline: 'Votre compagnon de voyage intelligent pour des trips sans stress.',
        langTitle: 'Disponible en 18 langues',
        signIn: 'Connexion'
    },
    'es': {
        title: 'TripPortier - Viaja Más Inteligente',
        badge: 'Plataforma de Viajes con IA',
        heroTitle1: 'Viaja por el mundo',
        heroTitle2: 'como un',
        typingWords: "['Pro', 'Local', 'VIP', 'Explorador', 'Aventurero']",
        heroSubtitle: 'Datos eSIM. Traslados aeropuerto. Seguimiento de vuelos. Planificación con IA. Todo lo que necesitas — una app.',
        socialTitle: 'Amado por viajeros de todo el mundo',
        featuresTitle: 'Todo para tu viaje',
        ctaTitle: 'Comienza tu próxima aventura',
        langTitle: 'Disponible en 18 idiomas',
        signIn: 'Iniciar Sesión'
    },
    'it': {
        title: 'TripPortier - Viaggia Più Intelligente',
        badge: 'Piattaforma di Viaggio con IA',
        heroTitle1: 'Viaggia per il mondo',
        heroTitle2: 'come un',
        typingWords: "['Pro', 'Locale', 'VIP', 'Esploratore', 'Avventuriero']",
        heroSubtitle: 'Dati eSIM. Trasferimenti aeroporto. Tracciamento voli. Pianificazione IA. Tutto ciò di cui hai bisogno — un\'app.',
        socialTitle: 'Amato dai viaggiatori di tutto il mondo',
        featuresTitle: 'Tutto per il tuo viaggio',
        ctaTitle: 'Inizia la tua prossima avventura',
        langTitle: 'Disponibile in 18 lingue',
        signIn: 'Accedi'
    },
    'nl': {
        title: 'TripPortier - Reis Slimmer',
        badge: 'AI-Aangedreven Reisplatform',
        heroTitle1: 'Reis de wereld rond',
        heroTitle2: 'als een',
        typingWords: "['Pro', 'Local', 'VIP', 'Ontdekker', 'Avonturier']",
        heroSubtitle: 'eSIM-data. Luchthaventransfers. Vluchttracering. AI-planning. Alles wat je nodig hebt — één app.',
        socialTitle: 'Geliefd door reizigers wereldwijd',
        featuresTitle: 'Alles voor je reis',
        ctaTitle: 'Start je volgende avontuur',
        langTitle: 'Beschikbaar in 18 talen',
        signIn: 'Inloggen'
    },
    'pt-BR': {
        title: 'TripPortier - Viaje Mais Inteligente',
        badge: 'Plataforma de Viagem com IA',
        heroTitle1: 'Viaje pelo mundo',
        heroTitle2: 'como um',
        typingWords: "['Pro', 'Local', 'VIP', 'Explorador', 'Aventureiro']",
        heroSubtitle: 'Dados eSIM. Transfers aeroporto. Rastreio de voos. Planejamento IA. Tudo que você precisa — um app.',
        socialTitle: 'Amado por viajantes no mundo todo',
        featuresTitle: 'Tudo para sua viagem',
        ctaTitle: 'Comece sua próxima aventura',
        langTitle: 'Disponível em 18 idiomas',
        signIn: 'Entrar'
    },
    'ja': {
        title: 'TripPortier - スマートに旅する',
        badge: 'AI搭載トラベルプラットフォーム',
        heroTitle1: '世界を旅する',
        heroTitle2: '',
        typingWords: "['プロのように', '地元民のように', 'VIPのように', '探検家のように', '冒険家のように']",
        heroSubtitle: 'eSIMデータ。空港送迎。フライト追跡。AI計画。必要なものすべて — 1つのアプリで。',
        socialTitle: '世界中の旅行者に愛されています',
        featuresTitle: '旅行に必要なすべて',
        ctaTitle: '次の冒険を始めよう',
        langTitle: '18言語で利用可能',
        signIn: 'ログイン'
    },
    'ko': {
        title: 'TripPortier - 스마트하게 여행하세요',
        badge: 'AI 기반 여행 플랫폼',
        heroTitle1: '세계를 여행하세요',
        heroTitle2: '',
        typingWords: "['프로처럼', '현지인처럼', 'VIP처럼', '탐험가처럼', '모험가처럼']",
        heroSubtitle: 'eSIM 데이터. 공항 픽업. 항공편 추적. AI 계획. 필요한 모든 것 — 하나의 앱.',
        socialTitle: '전 세계 여행자들이 사랑합니다',
        featuresTitle: '여행에 필요한 모든 것',
        ctaTitle: '다음 모험을 시작하세요',
        langTitle: '18개 언어로 이용 가능',
        signIn: '로그인'
    },
    'zh-Hans': {
        title: 'TripPortier - 更智能地旅行',
        badge: 'AI驱动旅行平台',
        heroTitle1: '环游世界',
        heroTitle2: '像',
        typingWords: "['专业人士', '当地人', 'VIP', '探险家', '冒险家']",
        heroSubtitle: 'eSIM数据。机场接送。航班追踪。AI规划。你需要的一切 — 一个应用。',
        socialTitle: '深受全球旅行者喜爱',
        featuresTitle: '旅行所需的一切',
        ctaTitle: '开始你的下一次冒险',
        langTitle: '提供18种语言',
        signIn: '登录'
    },
    'zh-Hant': {
        title: 'TripPortier - 更智慧地旅行',
        badge: 'AI驅動旅行平台',
        heroTitle1: '環遊世界',
        heroTitle2: '像',
        typingWords: "['專業人士', '當地人', 'VIP', '探險家', '冒險家']",
        heroSubtitle: 'eSIM數據。機場接送。航班追蹤。AI規劃。你需要的一切 — 一個應用。',
        socialTitle: '深受全球旅行者喜愛',
        featuresTitle: '旅行所需的一切',
        ctaTitle: '開始你的下一次冒險',
        langTitle: '提供18種語言',
        signIn: '登入'
    },
    'ar': {
        title: 'TripPortier - سافر بذكاء',
        badge: 'منصة سفر مدعومة بالذكاء الاصطناعي',
        heroTitle1: 'سافر حول العالم',
        heroTitle2: 'مثل',
        typingWords: "['المحترفين', 'السكان المحليين', 'كبار الشخصيات', 'المستكشفين', 'المغامرين']",
        heroSubtitle: 'بيانات eSIM. نقل المطار. تتبع الرحلات. تخطيط بالذكاء الاصطناعي. كل ما تحتاجه — تطبيق واحد.',
        socialTitle: 'محبوب من المسافرين حول العالم',
        featuresTitle: 'كل ما تحتاجه لرحلتك',
        ctaTitle: 'ابدأ مغامرتك القادمة',
        langTitle: 'متوفر بـ 18 لغة',
        signIn: 'تسجيل الدخول'
    },
    'sv': {
        title: 'TripPortier - Res Smartare',
        badge: 'AI-driven Reseplattform',
        heroTitle1: 'Res världen runt',
        heroTitle2: 'som en',
        typingWords: "['Proffs', 'Lokalbo', 'VIP', 'Upptäckare', 'Äventyrare']",
        heroSubtitle: 'eSIM-data. Flygplatstransfer. Flygspårning. AI-planering. Allt du behöver — en app.',
        socialTitle: 'Älskad av resenärer världen över',
        featuresTitle: 'Allt för din resa',
        ctaTitle: 'Börja ditt nästa äventyr',
        langTitle: 'Tillgänglig på 18 språk',
        signIn: 'Logga In'
    },
    'da': {
        title: 'TripPortier - Rejs Smartere',
        badge: 'AI-drevet Rejseplatform',
        heroTitle1: 'Rejs verden rundt',
        heroTitle2: 'som en',
        typingWords: "['Professionel', 'Lokal', 'VIP', 'Opdagelsesrejsende', 'Eventyrer']",
        heroSubtitle: 'eSIM-data. Lufthavnstransfer. Flysporing. AI-planlægning. Alt hvad du har brug for — én app.',
        socialTitle: 'Elsket af rejsende verden over',
        featuresTitle: 'Alt til din rejse',
        ctaTitle: 'Start dit næste eventyr',
        langTitle: 'Tilgængelig på 18 sprog',
        signIn: 'Log Ind'
    },
    'nb': {
        title: 'TripPortier - Reis Smartere',
        badge: 'AI-drevet Reiseplattform',
        heroTitle1: 'Reis verden rundt',
        heroTitle2: 'som en',
        typingWords: "['Proff', 'Lokal', 'VIP', 'Oppdager', 'Eventyrer']",
        heroSubtitle: 'eSIM-data. Flyplasstransport. Flysporing. AI-planlegging. Alt du trenger — én app.',
        socialTitle: 'Elsket av reisende over hele verden',
        featuresTitle: 'Alt for reisen din',
        ctaTitle: 'Start ditt neste eventyr',
        langTitle: 'Tilgjengelig på 18 språk',
        signIn: 'Logg Inn'
    },
    'fi': {
        title: 'TripPortier - Matkusta Älykkäämmin',
        badge: 'Tekoälypohjainen Matkustusalusta',
        heroTitle1: 'Matkusta maailmaa',
        heroTitle2: 'kuin',
        typingWords: "['Ammattilainen', 'Paikallinen', 'VIP', 'Tutkimusmatkailija', 'Seikkailija']",
        heroSubtitle: 'eSIM-data. Lentokenttäkuljetukset. Lentojen seuranta. Tekoälysuunnittelu. Kaikki mitä tarvitset — yksi sovellus.',
        socialTitle: 'Matkailijoiden rakastama kaikkialla maailmassa',
        featuresTitle: 'Kaikki matkaasi varten',
        ctaTitle: 'Aloita seuraava seikkailusi',
        langTitle: 'Saatavilla 18 kielellä',
        signIn: 'Kirjaudu'
    },
    'th': {
        title: 'TripPortier - เดินทางอย่างชาญฉลาด',
        badge: 'แพลตฟอร์มการท่องเที่ยวที่ขับเคลื่อนด้วย AI',
        heroTitle1: 'เดินทางรอบโลก',
        heroTitle2: 'เหมือน',
        typingWords: "['มืออาชีพ', 'คนท้องถิ่น', 'VIP', 'นักสำรวจ', 'นักผจญภัย']",
        heroSubtitle: 'ข้อมูล eSIM รถรับส่งสนามบิน ติดตามเที่ยวบิน การวางแผน AI ทุกอย่างที่คุณต้องการ — แอปเดียว',
        socialTitle: 'เป็นที่รักของนักเดินทางทั่วโลก',
        featuresTitle: 'ทุกอย่างสำหรับการเดินทางของคุณ',
        ctaTitle: 'เริ่มต้นการผจญภัยครั้งต่อไปของคุณ',
        langTitle: 'มีให้บริการใน 18 ภาษา',
        signIn: 'เข้าสู่ระบบ'
    },
    'tr': {
        title: 'TripPortier - Daha Akıllı Seyahat Et',
        badge: 'Yapay Zeka Destekli Seyahat Platformu',
        heroTitle1: 'Dünyayı gez',
        heroTitle2: 'bir',
        typingWords: "['Profesyonel', 'Yerel', 'VIP', 'Kaşif', 'Maceracı']",
        heroSubtitle: 'eSIM verisi. Havalimanı transferleri. Uçuş takibi. Yapay zeka planlaması. İhtiyacınız olan her şey — tek uygulama.',
        socialTitle: 'Dünya çapında gezginler tarafından seviliyor',
        featuresTitle: 'Seyahatiniz için her şey',
        ctaTitle: 'Bir sonraki maceranıza başlayın',
        langTitle: '18 dilde mevcut',
        signIn: 'Giriş Yap'
    }
};

// Generate each language version
languages.forEach(lang => {
    if (lang === 'en') return; // Skip English, already exists

    console.log(`Generating ${lang}...`);

    // Create directory
    const langDir = path.join(__dirname, lang);
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
    }

    let html = template;
    const r = replacements[lang] || {};

    // Update lang attribute
    html = html.replace('lang="en"', `lang="${lang}"`);

    // Update canonical and og:url
    html = html.replace(/href="https:\/\/tripportier\.com\/en\/"/g, `href="https://tripportier.com/${lang}/"`);
    html = html.replace(/content="https:\/\/tripportier\.com\/en\/"/g, `content="https://tripportier.com/${lang}/"`);

    // Update page title
    if (r.title) {
        html = html.replace('<title>TripPortier - Travel Smarter</title>', `<title>${r.title}</title>`);
    }

    // Update hero badge
    if (r.badge) {
        html = html.replace('AI-Powered Travel Platform', r.badge);
    }

    // Update hero title
    if (r.heroTitle1) {
        html = html.replace('>Travel the world<', `>${r.heroTitle1}<`);
    }
    if (r.heroTitle2 !== undefined) {
        html = html.replace('>like a <', `>${r.heroTitle2} <`);
    }

    // Update typing words
    if (r.typingWords) {
        html = html.replace("const words = ['Pro', 'Local', 'VIP', 'Explorer', 'Adventurer'];", `const words = ${r.typingWords};`);
    }

    // Update hero subtitle
    if (r.heroSubtitle) {
        html = html.replace(
            'eSIM data. Airport transfers. Flight tracking. AI planning. Everything you need — one app.',
            r.heroSubtitle
        );
    }

    // Update floating elements
    if (r.float1) {
        html = html.replace('AI Itinerary Ready', r.float1);
    }
    if (r.float2) {
        html = html.replace('200+ Countries', r.float2);
    }
    if (r.float3) {
        html = html.replace('Boarding for your flight starts now', r.float3);
    }

    // Update social proof title
    if (r.socialTitle) {
        html = html.replace('Loved by travelers worldwide', r.socialTitle);
    }

    // Update features title
    if (r.featuresTitle) {
        html = html.replace('Everything for your trip', r.featuresTitle);
    }

    // Update CTA title
    if (r.ctaTitle) {
        html = html.replace('Start your next adventure', r.ctaTitle);
    }

    // Update language title in footer
    if (r.langTitle) {
        html = html.replace('Available in 18 languages', r.langTitle);
    }

    // Update Sign In button
    if (r.signIn) {
        html = html.replace('>Sign In</a>', `>${r.signIn}</a>`);
    }

    // Update active language in navbar dropdown
    html = html.replace(`href="/en/" class="lang-option active"`, `href="/en/" class="lang-option"`);
    html = html.replace(`href="/${lang}/" class="lang-option"`, `href="/${lang}/" class="lang-option active"`);

    // Update active language in footer
    html = html.replace(`href="/en/" class="footer-lang active"`, `href="/en/" class="footer-lang"`);
    html = html.replace(`href="/${lang}/" class="footer-lang"`, `href="/${lang}/" class="footer-lang active"`);

    // Update language preference save
    html = html.replace("TripPortierI18n.saveLanguage('en');", `TripPortierI18n.saveLanguage('${lang}');`);

    // Write the file
    const outputPath = path.join(langDir, 'index.html');
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`  Created ${outputPath}`);
});

console.log('\nDone! Generated all language versions.');
