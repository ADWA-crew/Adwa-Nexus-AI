import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
  "nav": {
    "home": "Home",
    "museums": "Museums",
    "artifacts": "Artifacts",
    "routes": "Routes",
    "selectLanguage": "Select language",
    "openMenu": "Open menu",
    "closeMenu": "Close menu"
  },
  "hero": {
    "badge": "Ethiopia's #1 Heritage Platform",
    "titleLine1": "Discover Ethiopia's",
    "titleLine2": "Living History",
    "description": "Explore Ethiopia's museums, historical artifacts, and legendary heritage through immersive digital experiences.",
    "startJourney": "Start Journey",
    "discoverEthiopia": "Discover Ethiopia",
    "scroll": "Scroll to explore"
  },
  "common": {
    "language": "Language"
  },
  "startJourney": {
    "backToHome": "Back to home"
  },
  "personalization": {
    "step": "Step 1 of 1",
    "title": "Personalize Your Journey",
    "subtitle": "Tell us who you are and we will shape the museum experience around you.",
    "fullName": "Full Name",
    "fullNamePlaceholder": "e.g. Selam Tesfaye",
    "visitingAs": "I am visiting as",
    "selectVisitorType": "Select visitor type",
    "ageGroup": "Age Group",
    "educationBackground": "Education Background",
    "selectEducation": "Select your education level",
    "submit": "Submit",
    "preparing": "Preparing your experience\u2026",
    "errorNameReq": "Please enter your full name.",
    "errorNameMin": "Name must be at least 2 characters.",
    "errorTypeReq": "Please choose a visitor type.",
    "errorAgeReq": "Please select your age group.",
    "errorEduReq": "Please select your education background.",
    "submitError": "We could not start your journey. Please try again.",
    "types": {
      "tourist": "Tourist",
      "touristHint": "Exploring for leisure and discovery",
      "research": "For Research",
      "researchHint": "Academic or professional study",
      "child": "Child",
      "childHint": "A young explorer under 18"
    },
    "ages": {
      "under18": "Under 18",
      "above18": "Above 18"
    },
    "education": {
      "primary": "Primary School",
      "highschool": "High School",
      "university": "University Degree",
      "diploma": "Diploma",
      "other": "Other"
    }
  },
  "tourist": {
    "badge": "Guided visit",
    "welcome": "Welcome, {{name}}",
    "defaultSummary": "A cinematic walk through Ethiopia\u2019s defining moments \u2014 scan any display to read its story, hear it narrated, or watch it on film.",
    "routesTitle": "Routes picked for you",
    "stopsCount": "{{count}} stops",
    "scanTitle": "Scan the code beside an exhibit",
    "scanText": "Point your camera at the QR code on any display to open its story in text, sound, or film."
  },
  "researcher": {
    "badge": "Research access",
    "hello": "Hello, {{name}}",
    "text": "Welcome to our museum. Your reading room is open \u2014 scan any display to open its full account, narration, and archive footage.",
    "scanTitle": "Scan the code beside a record",
    "scanText": "Point your camera at the QR code on any display to open the full account, hear it narrated, or watch the film."
  },
  "child": {
    "badge": "Young explorer",
    "hello": "Hi {{name}}, ready to explore?",
    "text": "Find a picture code next to anything in the museum and scan it. Then you can read the story, listen to it, or watch a little film.",
    "step1": "Find a code",
    "step2": "Scan it",
    "step3": "Read, listen, or watch",
    "scanTitle": "Scan a picture code",
    "scanText": "Hold your camera up to the square code next to the exhibit. We will read the story to you."
  },
  "museums": {
    "eyebrow": "Catalogue",
    "title": "Museums",
    "lead": "Explore Adwa Nexus venues and the galleries that hold Ethiopia\u2019s story.",
    "loading": "Loading museums\u2026",
    "error": "Could not load museums. Is the API running?",
    "noMuseums": "No museums are published yet.",
    "galleriesCount": "{{count}} galleries",
    "exhibitsCount": "{{count}} exhibits",
    "allMuseums": "All museums",
    "galleriesTitle": "Galleries",
    "exhibitsTitle": "Exhibits"
  },
  "artifacts": {
    "eyebrow": "Catalogue",
    "title": "Artifacts & exhibits",
    "lead": "Browse published displays \u2014 open any item for the full text, audio, and film experience.",
    "loading": "Loading exhibits\u2026",
    "error": "Could not load exhibits. Is the API running?",
    "noArtifacts": "No exhibits are published yet.",
    "openFullExhibit": "Open full exhibit",
    "backToCatalogue": "Back to catalogue"
  },
  "routes": {
    "eyebrow": "Guided paths",
    "title": "Tour routes",
    "leadMatched": "Routes matched to your {{profile}} experience.",
    "leadDefault": "Story paths through the museum \u2014 start a journey to personalize these.",
    "loading": "Loading routes\u2026",
    "error": "Could not load routes. Is the API running?",
    "noRoutes": "No routes published for this profile yet.",
    "stopsTitle": "Stops",
    "noStops": "Stops will appear here once published.",
    "allRoutes": "All routes"
  },
  "profile": {
    "eyebrow": "Your visit",
    "defaultSummary": "Start a journey to personalize tone, reading level, and recommended routes.",
    "type": "Type",
    "ageGroup": "Age group",
    "education": "Education",
    "experience": "Experience",
    "tone": "Tone",
    "noSession": "No active session yet. Personalize your visit to unlock a tailored path.",
    "restartJourney": "Restart journey",
    "startJourney": "Start journey",
    "viewRoutes": "View routes",
    "clearSession": "Clear session"
  },
  "exhibit": {
    "readTab": "Read",
    "listenTab": "Listen",
    "watchTab": "Watch",
    "fullStory": "Full story",
    "readAloud": "Read aloud",
    "shortFilm": "Short film",
    "minRead": "{{minutes}} min read",
    "textSize": "Text size",
    "preferToListen": "Prefer to listen? Play the narration",
    "cannotReadAloud": "This browser cannot read text aloud. Chrome, Edge and Safari support narration \u2014 meanwhile the full story is on the Read tab.",
    "openWrittenStory": "Open the written story",
    "listenToExhibit": "Listen to this exhibit",
    "narrating": "Narrating\u2026",
    "paused": "Paused",
    "guideReadsAloud": "The guide reads the full story aloud and follows along with the text.",
    "wordsHighlight": "Words highlight as they are spoken.",
    "restart": "Restart",
    "stop": "Stop",
    "watchShortFilm": "Watch the short film",
    "openOnYoutube": "Open on YouTube",
    "readTranscript": "Read the transcript",
    "missingTitle": "This code has no exhibit yet",
    "missingText": "The label may be from another gallery. Please try the code on the display again.",
    "backToMuseum": "Back to the museum"
  },
  "scan": {
    "scannedExhibit": "Scanned exhibit",
    "scanAnother": "Scan another",
    "scanQrCode": "Scan QR code",
    "openingExhibit": "Opening exhibit\u2026",
    "invalidCode": "That code does not belong to an exhibit in this museum."
  },
  "aiGuide": {
    "concierge": "Museum Concierge",
    "title": "Adwa Guide",
    "welcomeMsg": "Welcome. I am Adwa Guide \u2014 ask me about the museum, the Battle of Adwa, artifacts, or planning your visit.",
    "language": "Language",
    "thinking": "Composing a reply\u2026",
    "placeholder": "Ask about Adwa, artifacts, or your visit\u2026",
    "closeGuide": "Close guide",
    "hideConv": "Hide conversation",
    "textAndVoice": "Text & voice \u00b7 Multilingual",
    "micAccessError": "Microphone access is required for voice conversation."
  },
  "notFound": {
    "title": "404 - Page Not Found",
    "backHome": "Back to Home"
  }
},
  },
  am: {
    translation: {
  "nav": {
    "home": "መነሻ",
    "museums": "ሙዚየሞች",
    "artifacts": "ቅርሶች",
    "routes": "መንገዶች",
    "selectLanguage": "ቋንቋ ይምረጡ",
    "openMenu": "ምናሌ ክፈት",
    "closeMenu": "ምናሌ ዝጋ"
  },
  "hero": {
    "badge": "የኢትዮጵያ #1 ቅርስ መድረክ",
    "titleLine1": "የኢትዮጵያን",
    "titleLine2": "ሕያው ታሪክ ያግኙ",
    "description": "የኢትዮጵያን ሙዚየሞች፣ ታሪካዊ ቅርሶች እና አፈ ታሪካዊ ቅርስ በተግባራዊ ዲጂታል ተሞክሮ ያስሱ።",
    "startJourney": "ጉዞ ጀምር",
    "discoverEthiopia": "ኢትዮጵያን ያግኙ",
    "scroll": "ለመቃኘት ይሸብልሉ"
  },
  "common": {
    "language": "ቋንቋ"
  },
  "startJourney": {
    "backToHome": "ወደ መነሻ ተመለስ"
  },
  "personalization": {
    "step": "ደረጃ 1 ከ 1",
    "title": "ጉዞዎን ያበጁ",
    "subtitle": "ማን እንደሆኑ ይንገሩን እና የሙዚየሙን ተሞክሮ በእርስዎ ዙሪያ እንቀርፃለን።",
    "fullName": "ሙሉ ስም",
    "fullNamePlaceholder": "ምሳሌ፡ ሰላም ተስፋዬ",
    "visitingAs": "የምጎበኘው እንደ",
    "selectVisitorType": "የጎብኚ ዓይነት ይምረጡ",
    "ageGroup": "የዕድሜ ክልል",
    "educationBackground": "የትምህርት ደረጃ",
    "selectEducation": "የትምህርት ደረጃዎን ይምረጡ",
    "submit": "አስገባ",
    "preparing": "ተሞክሮዎን በማዘጋጀት ላይ...",
    "errorNameReq": "እባክዎን ሙሉ ስምዎን ያስገቡ።",
    "errorNameMin": "ስም ቢያንስ 2 ቁምፊዎች መሆን አለበት።",
    "errorTypeReq": "እባክዎን የጎብኚ ዓይነት ይምረጡ።",
    "errorAgeReq": "እባክዎን የዕድሜ ክልልዎን ይምረጡ።",
    "errorEduReq": "እባክዎን የትምህርት ደረጃዎን ይምረጡ።",
    "submitError": "ጉዞዎን መጀመር አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
    "types": {
      "tourist": "ጎብኚ",
      "touristHint": "ለመዝናናት እና ለማወቅ የሚጎበኝ",
      "research": "ለምርምር",
      "researchHint": "ለትምህርታዊ ወይም ለሙያዊ ጥናት",
      "child": "ሕፃን",
      "childHint": "ከ18 ዓመት በታች ያለ ወጣት አበዳሽ"
    },
    "ages": {
      "under18": "ከ18 ዓመት በታች",
      "above18": "ከ18 ዓመት በላይ"
    },
    "education": {
      "primary": "የመጀመሪያ ደረጃ ትምህርት ቤት",
      "highschool": "ሁለተኛ ደረጃ ትምህርት ቤት",
      "university": "የዩኒቨርሲቲ ዲግሪ",
      "diploma": "ዲፕሎማ",
      "other": "ሌላ"
    }
  },
  "tourist": {
    "badge": "የመሪነት ጉብኝት",
    "welcome": "እንኳን ደህና መጡ፣ {{name}}",
    "defaultSummary": "በኢትዮጵያ ወሳኝ ታሪኮች ውስጥ የተደረገ ጉዞ — ታሪኩን ለማንበብ፣ ለማዳመጥ ወይም በቪዲዮ ለመመልከት ማንኛውንም ማሳያ ስካን ያድርጉ።",
    "routesTitle": "ለእርስዎ የተመረጡ መንገዶች",
    "stopsCount": "{{count}} ማቆሚያዎች",
    "scanTitle": "ከቅርሱ አጠገብ ያለውን ኮድ ስካን ያድርጉ",
    "scanText": "ታሪኩን በጽሑፍ፣ በድምፅ ወይም በቪዲዮ ለመክፈት ካሜራዎን በማሳያው ላይ ባለው QR ኮድ ላይ ያድርጉ።"
  },
  "researcher": {
    "badge": "የምርምር መዳረሻ",
    "hello": "ሰላም፣ {{name}}",
    "text": "እንኳን ወደ ሙዚየማችን በደህና መጡ። የማንበቢያ ክፍልዎ ክፍት ነው — ሙሉውን መረጃ፣ ትረካ እና የአርካይቭ ቪዲዮ ለመክፈት ማንኛውንም ማሳያ ስካን ያድርጉ።",
    "scanTitle": "ከመዝገቡ አጠገብ ያለውን ኮድ ስካን ያድርጉ",
    "scanText": "ሙሉውን መረጃ ለመክፈት፣ ትረካውን ለማዳመጥ ወይም ቪዲዮውን ለመመልከት ካሜራዎን በማሳያው ላይ ባለው QR ኮድ ላይ ያድርጉ።"
  },
  "child": {
    "badge": "ወጣት አበዳሽ",
    "hello": "ሰላም {{name}}፣ ለመቃኘት ዝግጁ ነህ/ሽ?",
    "text": "በሙዚየሙ ውስጥ ከማንኛውም ነገር አጠገብ ያለውን የስዕል ኮድ አግኝተህ/ሽ ስካን አድርግ/ጊ። ከዚያ ታሪኩን ማንበብ፣ ማዳመጥ ወይም አጭር ቪዲዮ ማየት ትችላለህ/ሽ።",
    "step1": "ኮድ ፈልግ/ጊ",
    "step2": "ስካን አድርግ/ጊ",
    "step3": "ንበብ/ቢ፣ አዳምጥ/ጪ ወይም እይ/ዪ",
    "scanTitle": "የስዕል ኮድ ስካን አድርግ/ጊ",
    "scanText": "ካሜራህን/ሽን ከቅርሱ አጠገብ ባለው አራት ማዕዘን ኮድ ላይ ያዝ/ዢ። ታሪኩን እናነብልሃለን/ልሻለን።"
  },
  "museums": {
    "eyebrow": "ካታሎግ",
    "title": "ሙዚየሞች",
    "lead": "የአድዋ ኔክሰስ ቦታዎችን እና የኢትዮጵያን ታሪክ የያዙትን ጋለሪዎች ያ hisሱ።",
    "loading": "ሙዚየሞችን በመጫን ላይ...",
    "error": "ሙዚየሞችን መጫን አልተቻለም። API እየሰራ ነው?",
    "noMuseums": "እስካሁን የታተሙ ሙዚየሞች የሉም።",
    "galleriesCount": "{{count}} ጋለሪዎች",
    "exhibitsCount": "{{count}} ቅርሶች",
    "allMuseums": "ሁሉም ሙዚየሞች",
    "galleriesTitle": "ጋለሪዎች",
    "exhibitsTitle": "ቅርሶች"
  },
  "artifacts": {
    "eyebrow": "ካታሎግ",
    "title": "ቅርሶች እና ማሳያዎች",
    "lead": "የታተሙ ማሳያዎችን ይቃኙ — ሙሉውን የጽሑፍ፣ የድምፅ እና የቪዲዮ ተሞክሮ ለማግኘት ማንኛውንም ዕቃ ይክፈቱ።",
    "loading": "ቅርሶችን በመጫን ላይ...",
    "error": "ቅርሶችን መጫን አልተቻለም። API እየሰራ ነው?",
    "noArtifacts": "እስካሁን የታተሙ ቅርሶች የሉም።",
    "openFullExhibit": "ሙሉውን ቅርስ ክፈት",
    "backToCatalogue": "ወደ ካታሎግ ተመለስ"
  },
  "routes": {
    "eyebrow": "የመሪነት መንገዶች",
    "title": "የጉብኝት መንገዶች",
    "leadMatched": "ከእርስዎ {{profile}} ተሞክሮ ጋር የሚጣጣሙ መንገዶች።",
    "leadDefault": "በሙዚየሙ ውስጥ ያሉ የታሪክ መንገዶች — እነዚህን ለማበጀት ጉዞ ይጀምሩ።",
    "loading": "መንገዶችን በመጫን ላይ...",
    "error": "መንገዶችን መጫን አልተቻለም። API እየሰራ ነው?",
    "noRoutes": "ለዚህ መገለጫ እስካሁን የታተሙ መንገዶች የሉም።",
    "stopsTitle": "ማቆሚያዎች",
    "noStops": "ማቆሚያዎች አንዴ ከተታተሙ በኋላ እዚህ ይታያሉ።",
    "allRoutes": "ሁሉም መንገዶች"
  },
  "profile": {
    "eyebrow": "የእርስዎ ጉብኝት",
    "defaultSummary": "የድምፅ ቅላጼን፣ የማንበብ ደረጃን እና የተመከሩ መንገዶችን ለማበጀት ጉዞ ይጀምሩ።",
    "type": "ዓይነት",
    "ageGroup": "የዕድሜ ክልል",
    "education": "ትምህርት",
    "experience": "ተሞክሮ",
    "tone": "ቅላጼ",
    "noSession": "እስካሁን ምንም ንቁ ክፍለ ጊዜ የለም። የተዘጋጀ መንገድ ለመክፈት ጉብኝትዎን ያበጁ።",
    "restartJourney": "ጉዞውን እንደገና ጀምር",
    "startJourney": "ጉዞ ጀምር",
    "viewRoutes": "መንገዶችን ተመልከት",
    "clearSession": "ክፍለ ጊዜውን አፅዳ"
  },
  "exhibit": {
    "readTab": "ንበብ",
    "listenTab": "አዳምጥ",
    "watchTab": "ተመልከት",
    "fullStory": "ሙሉ ታሪክ",
    "readAloud": "በድምፅ ያንብቡ",
    "shortFilm": "አጭር ቪዲዮ",
    "minRead": "{{minutes}} ደቂቃ ንባብ",
    "textSize": "የጽሑፍ መጠን",
    "preferToListen": "ማዳመጥ ይመርጣሉ? ትረካውን ያጫውቱ",
    "cannotReadAloud": "ይህ አሳሽ ጽሑፍን በድምፅ ማንበብ አይችልም። Chrome, Edge እና Safari ትረካን ይደግፋሉ — እስከዚያው ሙሉው ታሪክ በንባብ ትር ላይ ይገኛል።",
    "openWrittenStory": "የተጻፈውን ታሪክ ክፈት",
    "listenToExhibit": "ይህንን ቅርስ ያዳምጡ",
    "narrating": "በመተርክ ላይ...",
    "paused": "ቆሟል",
    "guideReadsAloud": "መሪው ሙሉውን ታሪክ በድምፅ ያነባል እና ከጽሑፉ ጋር ይከተላል።",
    "wordsHighlight": "ቃላቱ ሲነገሩ ጎልተው ይታያሉ።",
    "restart": "እንደገና ጀምር",
    "stop": "ቁም",
    "watchShortFilm": "አጫጭር ቪዲዮውን ይመልከቱ",
    "openOnYoutube": "በYouTube ላይ ክፈት",
    "readTranscript": "ጽሑፉን ያንብቡ",
    "missingTitle": "ይህ ኮድ እስካሁን ምንም ቅርስ የለውም",
    "missingText": "ምልክቱ ከሌላ ጋለሪ ሊሆን ይችላል። እባክዎን በማሳያው ላይ ያለውን ኮድ እንደገና ይሞክሩ።",
    "backToMuseum": "ወደ ሙዚየሙ ተመለስ"
  },
  "scan": {
    "scannedExhibit": "የተቃኘ ቅርስ",
    "scanAnother": "ሌላ ስካን አድርግ",
    "scanQrCode": "QR ኮድ ስካን አድርግ",
    "openingExhibit": "ቅርስ በመክፈት ላይ...",
    "invalidCode": "ያ ኮድ በዚህ ሙዚየም ውስጥ ላለ ቅርስ አይመለከትም።"
  },
  "aiGuide": {
    "concierge": "የሙዚየም መሪ",
    "title": "የአድዋ መሪ",
    "welcomeMsg": "እንኳን ደህና መጡ። እኔ የአድዋ መሪ ነኝ — ስለ ሙዚየሙ፣ ስለ አድዋ ጦርነት፣ ስለ ቅርሶች ወይም ስለ ጉብኝትዎ እቅድ ጠይቁኝ።",
    "language": "ቋንቋ",
    "thinking": "መልስ በመጻፍ ላይ...",
    "placeholder": "ስለ አድዋ፣ ቅርሶች ወይም ጉብኝትዎ ጠይቁ...",
    "closeGuide": "መሪውን ዝጋ",
    "hideConv": "ውይይቱን ደብቅ",
    "textAndVoice": "ጽሑፍ እና ድምፅ · ባለብዙ ቋንቋ",
    "micAccessError": "ለድምፅ ውይይት የሜክሮፎን ፈቃድ ያስፈልጋል።"
  },
  "notFound": {
    "title": "404 - አልተገኘም",
    "backHome": "ወደ መነሻ ተመለስ"
  }
},
  },
};

function setDocumentLang(lng) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lng || 'am';
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'am'],
    nonExplicitSupportedLngs: true,
    /* Default for first visit (localStorage wins after the user switches) */
    lng: 'am',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'adwa-lang',
    },
  });

i18n.on('languageChanged', setDocumentLang);
setDocumentLang(i18n.resolvedLanguage || 'am');

export default i18n;
