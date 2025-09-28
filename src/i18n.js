// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          // --- Hero Section (Existing) ---
          heroTitlePart1: "Your Compass for the",
          heroTitlePart2: "Crossroads of Career.",
          heroSubtitle: "Navigate from confusion to clarity. Personalized guidance for Class 10 & 12 students in India.",
          
          // --- How It Works Section (NEW) ---
          howItWorksTitle: "A Clear Path in 3 Simple Steps",
          howItWorksSubtitle: "We've streamlined the complex process of career discovery into a journey you can trust.",
          step1Title: "Discover Your Aptitude",
          step1Desc: "Take our quick, insightful quiz to understand your unique strengths and interests. We analyze your responses to recommend the stream that best fits your personality and skills.",
          step2Title: "Explore Your Pathways",
          step2Desc: "Receive a personalized roadmap of streams, courses, and potential careers. Our AI-powered insights and visual mind maps make complex information easy to understand.",
          step3Title: "Connect with Mentors & Colleges",
          step3Desc: "Chat with our AI mentor, book one-on-one sessions with experienced seniors, and browse our detailed college directory to find your perfect fit."
        }
      },
      hi: {
        translation: {
          // --- Hero Section (Existing) ---
          heroTitlePart1: "करियर के चौराहे के लिए",
          heroTitlePart2: "आपका कम्पास।",
          heroSubtitle: "भ्रम से स्पष्टता की ओर बढ़ें। भारत में कक्षा 10 और 12 के छात्रों के लिए व्यक्तिगत मार्गदर्शन।",

          // --- How It Works Section (NEW) ---
          howItWorksTitle: "3 सरल चरणों में एक स्पष्ट मार्ग",
          howItWorksSubtitle: "हमने करियर खोज की जटिल प्रक्रिया को एक ऐसी यात्रा में बदल दिया है जिस पर आप भरोसा कर सकते हैं।",
          step1Title: "अपनी योग्यता खोजें",
          step1Desc: "अपनी अनूठी शक्तियों और रुचियों को समझने के लिए हमारी त्वरित, ज्ञानवर्धक प्रश्नोत्तरी लें। हम आपकी प्रतिक्रियाओं का विश्लेषण करके उस स्ट्रीम की सिफारिश करते हैं जो आपके व्यक्तित्व और कौशल के लिए सबसे उपयुक्त है।",
          step2Title: "अपने रास्ते तलाशें",
          step2Desc: "स्ट्रीम, पाठ्यक्रम और संभावित करियर का एक व्यक्तिगत रोडमैप प्राप्त करें। हमारी एआई-संचालित अंतर्दृष्टि और विज़ुअल माइंड मैप्स जटिल जानकारी को समझना आसान बनाते हैं।",
          step3Title: "गुरुओं और कॉलेजों से जुड़ें",
          step3Desc: "हमारे एआई गुरु से चैट करें, अनुभवी वरिष्ठों के साथ आमने-सामने सत्र बुक करें, और अपना आदर्श विकल्प खोजने के लिए हमारी विस्तृत कॉलेज निर्देशिका ब्राउज़ करें।"
        }
      },
      ks: {
        translation: {
          // --- Hero Section (Existing) ---
          heroTitlePart1: "کَریَرٕکِس چوراہَس خٲطرٕ",
          heroTitlePart2: "تُہُنٛد کمپاس۔",
          heroSubtitle: "پریشٲنی نِشہٕ وضاحت کُن پَکن۔ ہندوستانَس مَنٛز دَہِم تہٕ دُوآدَہِم جماعت کؠن طالب عٔلمَن خٲطرٕ ذٲتی رہنمٲیی۔",

          // --- How It Works Section (NEW) ---
          howItWorksTitle: "3 آسان مرحلَن مَنٛز اَکھ صاف رَسٛتہ",
          howItWorksSubtitle: "أسؠ چھُ کریر ژھانٛڈٕنٕک مشکل عمل اَکِس أیِس سفرس مَنٛز تبدیل کۆرمُت یَتھ پؠٹھ تُہؠ بھروسہٕ کٔرِتھ ہٮ۪کِو۔",
          step1Title: "پنُن قابلیت ژھانٛڈِو",
          step1Desc: "پنٕنی منفرد طاقتہٕ تہٕ شوق سمجھنہٕ خٲطرٕ نِیو أسُنٛد تیز، بصیرت مند کوئز۔ أسؠ چھِ تُہٕنٛدؠن جواباتن ہُنٛد تجزیہٕ کٔرِتھ تَتھ سٹریمٕچ سفارش کران یُس تُہٕنٛدِ شخصیت تہٕ مہارتن ہِنٛدِس خٲطرٕ بہترین چھُ۔",
          step2Title: "پنٕنؠ وتہٕ تلا ش کٔرِو",
          step2Desc: "سٹریم، کورس، تہٕ ممکنہٕ کریرن ہُنٛد اَکھ ذاتی روڈ میپ حٲصِل کٔرِو۔ أکؠ سٕندِ AI سۭتؠ چلن وٲلؠ بصیرت تہٕ بصری مائنڈ میپ چھِ مُشکل معلومات سمجھُن آسان بناوان۔",
          step3Title: "مِنتورَن تہٕ کالجن سۭتؠ رٲبطہٕ کٔرِو",
          step3Desc: "أسہِ سٕندِ AI مِنتور سۭتؠ گپھہٕ کٔرِو، تجربہٕ کار سینئرن سۭتؠ ون بہ ون سیشن بُک کٔرِو، تہٕ پنُن کامل فٹ ژھانٛڈنہٕ خٲطرٕ أسہِ ہٕنٛز تفصیلی کالج ڈائرکٹری براؤز کٔرِو۔"
        }
      }
    }
  });

export default i18n;