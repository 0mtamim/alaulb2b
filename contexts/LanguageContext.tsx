
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type LanguageCode = 'en' | 'zh' | 'bn' | 'ur' | 'fa' | 'ru' | 'ar' | 'de' | 'pt' | 'ms' | 'hi' | 'th' | 'ps';
type CurrencyCode = 'USD' | 'CNY' | 'EUR' | 'BTC';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
  t: (key: string) => string;
  isRTL: boolean;
  availableLanguages: { code: LanguageCode; label: string; flag: string }[];
  availableCurrencies: { code: CurrencyCode; symbol: string; rate: number }[];
}

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: 'Chinese (中文)', flag: '🇨🇳' },
  { code: 'bn', label: 'Bengali (বাংলা)', flag: '🇧🇩' },
  { code: 'ur', label: 'Urdu (اردو)', flag: '🇵🇰' },
  { code: 'fa', label: 'Persian (فارسی)', flag: '🇮🇷' },
  { code: 'ru', label: 'Russian (Русский)', flag: '🇷🇺' },
  { code: 'ar', label: 'Arabic (العربية)', flag: '🇸🇦' },
  { code: 'de', label: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'pt', label: 'Portuguese (Português)', flag: '🇵🇹' },
  { code: 'ms', label: 'Malay (Melayu)', flag: '🇲🇾' },
  { code: 'hi', label: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  { code: 'th', label: 'Thai (ไทย)', flag: '🇹🇭' },
  { code: 'ps', label: 'Pashto (پښتو)', flag: '🇦🇫' },
];

const CURRENCIES: { code: CurrencyCode; symbol: string; rate: number }[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'CNY', symbol: '¥', rate: 7.23 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'BTC', symbol: '₿', rate: 0.000015 },
];

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    hero_title: "Global Trade, Intelligently OS.",
    hero_subtitle: "Experience the world's first AI-native B2B marketplace. From predictive sourcing to smart logistics, manage your entire supply chain on TradeOS.",
    search_placeholder: "Search products or businesses...",
    btn_search: "Search",
    nav_invest: "Investment & Franchises",
    nav_events: "Trade Events",
    nav_rfq: "Submit RFQ",
    nav_dashboard: "TradeOS",
    nav_messages: "Messages",
    nav_profile: "Profile",
    btn_launch: "Launch TradeOS",
    btn_post_rfq: "Post an AI RFQ",
    verified_suppliers: "Verified Suppliers",
    ai_powered: "AI Powered",
    countries: "190+ Countries",
    // Dashboard & Product
    dash_overview: "Overview",
    dash_market: "Marketplace",
    dash_verify: "Verification Center",
    dash_trade_assurance: "Trade Assurance",
    dash_franchise: "Franchise & Partners",
    dash_invest: "Investment (M&A)",
    dash_jobs: "Jobs & Careers",
    dash_logistics: "Logistics Command",
    dash_insurance: "Insurance",
    dash_cpd: "R&D Projects",
    dash_events: "Trade Events",
    dash_settings: "System Settings",
    btn_contact: "Contact Supplier",
    btn_order: "Start Order",
    sect_specs: "Product Specifications",
    sect_reviews: "Customer Reviews",
    lbl_warranty: "Warranty",
    lbl_lead_time: "Lead Time",
    lbl_customization: "Customization"
  },
  zh: {
    hero_title: "全球贸易，智能操作系统。",
    hero_subtitle: "体验全球首个AI原生B2B市场。从预测性采购到智能物流，在TradeOS上管理您的整个供应链。",
    search_placeholder: "搜索产品或企业...",
    btn_search: "搜索",
    nav_invest: "投资与加盟",
    nav_events: "贸易展会",
    nav_rfq: "提交询价 (RFQ)",
    nav_dashboard: "TradeOS",
    nav_messages: "消息",
    nav_profile: "个人中心",
    btn_launch: "启动 TradeOS",
    btn_post_rfq: "发布 AI 询价",
    verified_suppliers: "认证供应商",
    ai_powered: "AI 驱动",
    countries: "190+ 国家",
    // Dashboard & Product
    dash_overview: "概览",
    dash_market: "市场管理",
    dash_verify: "认证中心",
    dash_trade_assurance: "信用保障",
    dash_franchise: "特许经营与合作伙伴",
    dash_invest: "投资并购",
    dash_jobs: "招聘求职",
    dash_logistics: "物流指挥",
    dash_insurance: "保险服务",
    dash_cpd: "研发项目",
    dash_events: "贸易展会",
    dash_settings: "系统设置",
    btn_contact: "联系供应商",
    btn_order: "开始订购",
    sect_specs: "产品规格",
    sect_reviews: "客户评价",
    lbl_warranty: "保修期",
    lbl_lead_time: "交货期",
    lbl_customization: "定制服务"
  },
  ar: {
    hero_title: "التجارة العالمية، بذكاء.",
    hero_subtitle: "جرب أول سوق B2B يعتمد على الذكاء الاصطناعي في العالم. من المصادر التنبؤية إلى الخدمات اللوجستية الذكية، أدر سلسلة التوريد الخاصة بك بالكامل على TradeOS.",
    search_placeholder: "البحث عن المنتجات أو الشركات...",
    btn_search: "بحث",
    nav_invest: "الاستثمار والامتيازات",
    nav_events: "الأحداث التجارية",
    nav_rfq: "إرسال طلب عرض أسعار",
    nav_dashboard: "نظام التجارة",
    nav_messages: "الرسائل",
    nav_profile: "الملف الشخصي",
    btn_launch: "تشغيل النظام",
    btn_post_rfq: "نشر طلب ذكي",
    verified_suppliers: "موردون موثوقون",
    ai_powered: "مدعوم بالذكاء الاصطناعي",
    countries: "190+ دولة",
    // Dashboard & Product
    dash_overview: "نظرة عامة",
    dash_market: "السوق",
    dash_verify: "مركز التحقق",
    dash_trade_assurance: "ضمان التجارة",
    dash_franchise: "الشركاء والامتياز",
    dash_invest: "الاستثمار (الاندماج والاستحواذ)",
    dash_jobs: "الوظائف",
    dash_logistics: "اللوجستيات",
    dash_insurance: "التأمين",
    dash_cpd: "مشاريع البحث والتطوير",
    dash_events: "المعارض التجارية",
    dash_settings: "إعدادات النظام",
    btn_contact: "اتصل بالمورد",
    btn_order: "ابدأ الطلب",
    sect_specs: "مواصفات المنتج",
    sect_reviews: "آراء العملاء",
    lbl_warranty: "الضمان",
    lbl_lead_time: "وقت التجهيز",
    lbl_customization: "التخصيص"
  },
  ru: {
    hero_title: "Глобальная торговля, Умная ОС.",
    hero_subtitle: "Испытайте первую в мире B2B-платформу на базе ИИ. От прогнозируемого поиска до умной логистики — управляйте всей цепочкой поставок в TradeOS.",
    search_placeholder: "Поиск товаров или компаний...",
    btn_search: "Поиск",
    nav_invest: "Инвестиции и франшизы",
    nav_events: "Торговые события",
    nav_rfq: "Отправить запрос",
    nav_dashboard: "TradeOS",
    nav_messages: "Сообщения",
    nav_profile: "Профиль",
    btn_launch: "Запустить TradeOS",
    btn_post_rfq: "Создать AI запрос",
    verified_suppliers: "Проверенные поставщики",
    ai_powered: "На базе ИИ",
    countries: "190+ стран",
    // Dashboard & Product
    dash_overview: "Обзор",
    dash_market: "Торговая площадка",
    dash_verify: "Центр верификации",
    dash_trade_assurance: "Торговая гарантия",
    dash_franchise: "Франшизы и партнеры",
    dash_invest: "Инвестиции (M&A)",
    dash_jobs: "Работа и карьера",
    dash_logistics: "Логистика",
    dash_insurance: "Страхование",
    dash_cpd: "R&D Проекты",
    dash_events: "События",
    dash_settings: "Настройки",
    btn_contact: "Связаться",
    btn_order: "Заказать",
    sect_specs: "Характеристики",
    sect_reviews: "Отзывы",
    lbl_warranty: "Гарантия",
    lbl_lead_time: "Срок поставки",
    lbl_customization: "Кастомизация"
  },
  de: {
    hero_title: "Globaler Handel, Intelligent OS.",
    hero_subtitle: "Erleben Sie den weltweit ersten KI-nativen B2B-Marktplatz. Von prädiktiver Beschaffung bis hin zu intelligenter Logistik – verwalten Sie Ihre gesamte Lieferkette auf TradeOS.",
    search_placeholder: "Produkte oder Unternehmen suchen...",
    btn_search: "Suchen",
    nav_invest: "Investitionen & Franchises",
    nav_events: "Handelsevents",
    nav_rfq: "RFQ senden",
    nav_dashboard: "TradeOS",
    nav_messages: "Nachrichten",
    nav_profile: "Profil",
    btn_launch: "TradeOS starten",
    btn_post_rfq: "KI-Anfrage stellen",
    verified_suppliers: "Verifizierte Lieferanten",
    ai_powered: "KI-gestützt",
    countries: "190+ Länder",
    // Dashboard & Product
    dash_overview: "Übersicht",
    dash_market: "Marktplatz",
    dash_verify: "Verifizierungszentrum",
    dash_trade_assurance: "Handelsversicherung",
    dash_franchise: "Franchise & Partner",
    dash_invest: "Investitionen",
    dash_jobs: "Karriere",
    dash_logistics: "Logistik",
    dash_insurance: "Versicherung",
    dash_cpd: "F&E Projekte",
    dash_events: "Messen",
    dash_settings: "Einstellungen",
    btn_contact: "Lieferant kontaktieren",
    btn_order: "Bestellung starten",
    sect_specs: "Produktspezifikationen",
    sect_reviews: "Kundenbewertungen",
    lbl_warranty: "Garantie",
    lbl_lead_time: "Lieferzeit",
    lbl_customization: "Anpassung"
  },
  bn: {
    hero_title: "বিশ্ব বাণিজ্য, বুদ্ধিমত্তার সাথে।",
    hero_subtitle: "বিশ্বের প্রথম এআই-নেটিভ বি টু বি মার্কেটপ্লেসের অভিজ্ঞতা নিন। সোর্সিং থেকে স্মার্ট লজিস্টিক পর্যন্ত, ট্রেডওএস-এ আপনার সম্পূর্ণ সাপ্লাই চেইন পরিচালনা করুন।",
    search_placeholder: "পণ্য বা ব্যবসা অনুসন্ধান করুন...",
    btn_search: "অনুসন্ধান",
    nav_invest: "বিনিয়োগ ও ফ্র্যাঞ্চাইজি",
    nav_events: "বাণিজ্য ইভেন্ট",
    nav_rfq: "RFQ জমা দিন",
    nav_dashboard: "ট্রেডওএস",
    nav_messages: "বার্তা",
    nav_profile: "প্রোফাইল",
    btn_launch: "ট্রেডওএস চালু করুন",
    btn_post_rfq: "এআই RFQ পোস্ট করুন",
    verified_suppliers: "যাচাইকৃত সরবরাহকারী",
    ai_powered: "এআই চালিত",
    countries: "১৯০+ দেশ"
  },
  ur: {
    hero_title: "عالمی تجارت، ذہانت کے ساتھ۔",
    hero_subtitle: "دنیا کے پہلے AI-native B2B مارکیٹ پلیس کا تجربہ کریں۔ سورسنگ سے لے کر سمارٹ لاجسٹکس تک، اپنی پوری سپلائی چین کو TradeOS پر منظم کریں۔",
    search_placeholder: "مصنوعات یا کاروبار تلاش کریں...",
    btn_search: "تلاش کریں",
    nav_invest: "سرمایہ کاری اور فرنچائزز",
    nav_events: "تجارتی تقریبات",
    nav_rfq: "RFQ جمع کروائیں",
    nav_dashboard: "ٹریڈ او ایس",
    nav_messages: "پیغامات",
    nav_profile: "پروفائل",
    btn_launch: "ٹریڈ او ایس چلائیں",
    btn_post_rfq: "AI RFQ پوسٹ کریں",
    verified_suppliers: "تصدیق شدہ سپلائرز",
    ai_powered: "AI سے چلنے والا",
    countries: "190+ ممالک"
  },
  fa: {
    hero_title: "تجارت جهانی، با هوشمندی.",
    hero_subtitle: "اولین بازار B2B مبتنی بر هوش مصنوعی در جهان را تجربه کنید. از منبع‌یابی پیش‌بینی‌کننده تا لجستیک هوشمند، زنجیره تأمین خود را در TradeOS مدیریت کنید.",
    search_placeholder: "جستجوی محصولات یا کسب‌وکارها...",
    btn_search: "جستجو",
    nav_invest: "سرمایه‌گذاری و نمایندگی",
    nav_events: "رویدادهای تجاری",
    nav_rfq: "ارسال RFQ",
    nav_dashboard: "سیستم تجاری",
    nav_messages: "پیام‌ها",
    nav_profile: "پروفایل",
    btn_launch: "راه‌اندازی سیستم",
    btn_post_rfq: "ارسال درخواست هوشمند",
    verified_suppliers: "تأمین‌کنندگان تأیید شده",
    ai_powered: "قدرت گرفته از هوش مصنوعی",
    countries: "۱۹۰+ کشور"
  },
  pt: {
    hero_title: "Comércio Global, Inteligente.",
    hero_subtitle: "Experimente o primeiro marketplace B2B nativo de IA do mundo. Do sourcing preditivo à logística inteligente, gerencie toda a sua cadeia de suprimentos no TradeOS.",
    search_placeholder: "Buscar produtos ou empresas...",
    btn_search: "Buscar",
    nav_invest: "Investimentos e Franquias",
    nav_events: "Eventos Comerciais",
    nav_rfq: "Enviar RFQ",
    nav_dashboard: "TradeOS",
    nav_messages: "Mensagens",
    nav_profile: "Perfil",
    btn_launch: "Iniciar TradeOS",
    btn_post_rfq: "Publicar RFQ IA",
    verified_suppliers: "Fornecedores Verificados",
    ai_powered: "Com IA",
    countries: "190+ Países"
  },
  ms: {
    hero_title: "Perdagangan Global, Pintar.",
    hero_subtitle: "Alami pasaran B2B natif AI pertama di dunia. Dari penyumberan ramalan hingga logistik pintar, uruskan keseluruhan rantaian bekalan anda di TradeOS.",
    search_placeholder: "Cari produk atau perniagaan...",
    btn_search: "Cari",
    nav_invest: "Pelaburan & Francais",
    nav_events: "Acara Perdagangan",
    nav_rfq: "Hantar RFQ",
    nav_dashboard: "TradeOS",
    nav_messages: "Mesej",
    nav_profile: "Profil",
    btn_launch: "Lancarkan TradeOS",
    btn_post_rfq: "Hantar RFQ AI",
    verified_suppliers: "Pembekal Disahkan",
    ai_powered: "Dikuasakan AI",
    countries: "190+ Negara"
  },
  hi: {
    hero_title: "वैश्विक व्यापार, बुद्धिमानी से।",
    hero_subtitle: "दुनिया के पहले एआई-मूल बी2बी मार्केटप्लेस का अनुभव करें। पूर्वानुमानित सोर्सिंग से लेकर स्मार्ट लॉजिस्टिक्स तक, अपनी पूरी आपूर्ति श्रृंखला को ट्रेडओएस पर प्रबंधित करें।",
    search_placeholder: "उत्पाद या व्यवसाय खोजें...",
    btn_search: "खोजें",
    nav_invest: "निवेश और फ्रेंचाइजी",
    nav_events: "व्यापार कार्यक्रम",
    nav_rfq: "RFQ जमा करें",
    nav_dashboard: "ट्रेडओएस",
    nav_messages: "संदेश",
    nav_profile: "प्रोफ़ाइल",
    btn_launch: "ट्रेडओएस लॉन्च करें",
    btn_post_rfq: "एआई RFQ पोस्ट करें",
    verified_suppliers: "सत्यापित आपूर्तिकर्ता",
    ai_powered: "एआई संचालित",
    countries: "190+ देश"
  },
  th: {
    hero_title: "การค้าระดับโลก อย่างชาญฉลาด",
    hero_subtitle: "สัมผัสประสบการณ์ตลาด B2B ที่ใช้ AI เป็นหลักแห่งแรกของโลก ตั้งแต่การจัดหาเชิงคาดการณ์ไปจนถึงโลจิสติกส์อัจฉริยะ จัดการห่วงโซ่อุปทานทั้งหมดของคุณบน TradeOS",
    search_placeholder: "ค้นหาสินค้าหรือธุรกิจ...",
    btn_search: "ค้นหา",
    nav_invest: "การลงทุนและแฟรนไชส์",
    nav_events: "งานแสดงสินค้า",
    nav_rfq: "ส่งใบเสนอราคา",
    nav_dashboard: "TradeOS",
    nav_messages: "ข้อความ",
    nav_profile: "โปรไฟล์",
    btn_launch: "เปิดใช้งาน TradeOS",
    btn_post_rfq: "โพสต์ RFQ ด้วย AI",
    verified_suppliers: "ซัพพลายเออร์ที่ตรวจสอบแล้ว",
    ai_powered: "ขับเคลื่อนด้วย AI",
    countries: "190+ ประเทศ"
  },
  ps: {
    hero_title: "نړیوال تجارت، په هوښیارۍ سره.",
    hero_subtitle: "د نړۍ لومړی AI-native B2B بازار تجربه کړئ. د وړاندوینې سرچینې څخه تر سمارټ لوژستیک پورې ، خپل ټول اکمالاتي سلسله په TradeOS کې اداره کړئ.",
    search_placeholder: "محصولات یا سوداګرۍ وپلټئ...",
    btn_search: "پلټنه",
    nav_invest: "پانګه اچونه",
    nav_events: "تجارتی پیښې",
    nav_rfq: "RFQ وسپارئ",
    nav_dashboard: "TradeOS",
    nav_messages: "پیغامونه",
    nav_profile: "پروفایل",
    btn_launch: "TradeOS پیل کړئ",
    btn_post_rfq: "AI RFQ پوسټ کړئ",
    verified_suppliers: "تایید شوي عرضه کونکي",
    ai_powered: "د AI لخوا پرمخ وړل کیږي",
    countries: "190+ هیوادونه"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  const isRTL = ['ar', 'ur', 'fa', 'ps'].includes(language);

  // Handle RTL Layout switching
  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const formatPrice = (amountInUSD: number): string => {
    const selectedCurr = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
    const converted = amountInUSD * selectedCurr.rate;
    
    // Formatting based on currency type
    if (currency === 'BTC') {
      return `${selectedCurr.symbol}${converted.toFixed(6)}`;
    }
    
    // Use Intl.NumberFormat for nice currency formatting if possible, else simpler fallback
    try {
       // Use the selected language for locale formatting, defaulting to en-US for 'en'
       const locale = language === 'en' ? 'en-US' : language;
       return new Intl.NumberFormat(locale, {
         style: 'currency',
         currency: currency
       }).format(converted);
    } catch(e) {
       return `${selectedCurr.symbol}${converted.toFixed(2)}`;
    }
  };

  return (
    <LanguageContext.Provider value={{ 
        language, setLanguage, 
        currency, setCurrency, 
        formatPrice,
        t, isRTL, 
        availableLanguages: LANGUAGES,
        availableCurrencies: CURRENCIES 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
