import type { EducationLevel } from '../types';

export interface CosmicEvent {
  time: number;
  name: string;
  description: string;
  visualizationPrompt: string;
  funFacts: string[];
}

export interface TranslationSet {
  // --- Global ---
  headerSubtitle: string;
  inputPlaceholder: string;
  
  // --- Education Levels ---
  welcomeToAstroChat: string;
  selectLevelPrompt: string;
  educationLevels: { name: EducationLevel, description: string }[];

  // --- Prompt Suggestions ---
  promptSuggestions: string[];

  // --- Timeline ---
  timelineTitle: string;
  timelineSubtitle: string;
  timelineAriaLabel: string;
  timelineAriaEventHover: string;
  timelineAriaEventSelected: string;
  buttonGenerateVis: string;
  visLoadingMessage: string; //
  visFunFactMessage: string;
  buttonAskWhileWaiting: string;
  visResultTitle: string;

  // --- Time Units ---
  timeUnitYear1: string;
  timeUnitYears: string;
  timeUnitThousand: string;
  timeUnitMillion: string;
  timeUnitBillion: string;

  // --- Chat ---
  astroChatGreeting: string;

  // --- Errors ---
  errorApiKeyNotFoundTitle: string;
  errorApiKeyNotFoundMessage: string;
  errorInitializationFailedTitle: string;
  errorUnexpectedErrorMessage: string;
  errorUnknownErrorTitle: string;
  errorUnknownErrorMessage: string;
  errorAuthErrorTitle: string;
  errorAuthErrorMessage: string;
  errorFailedToSendTitle: string;
  errorCosmicAnomaly: string;
  errorGenerationFailedTitle: string;
  errorGenerationFailed: string;

  // --- Events Data ---
  events: CosmicEvent[];
}

export const translations: Record<'en' | 'id', TranslationSet> = {
  // =================================================================================
  // English Translations
  // =================================================================================
  en: {
    headerSubtitle: "Your Personal Guide to the Cosmos",
    inputPlaceholder: "Ask about stars, planets, galaxies...",
    welcomeToAstroChat: "Welcome to AstroChat AI",
    selectLevelPrompt: "Select your knowledge level to begin your cosmic journey.",
    educationLevels: [
      { name: 'Elementary', description: 'Simple explanations & fun facts' },
      { name: 'High School', description: 'Clear concepts for students' },
      { name: 'Intermediate', description: 'In-depth, technical answers' },
    ],
    promptSuggestions: [
      "What is a black hole?",
      "Tell me about the James Webb Telescope.",
      "How are stars born?",
      "Explain dark matter in simple terms.",
    ],
    timelineTitle: "A Journey Through Cosmic Time",
    timelineSubtitle: "Explore 13.8 billion years of history. Click on an event to learn more and generate a unique AI visualization.",
    timelineAriaLabel: "Interactive vertical cosmic timeline",
    timelineAriaEventHover: "Hovering on event:",
    timelineAriaEventSelected: "Selected event:",
    buttonGenerateVis: "Generate Visualization",
    visLoadingMessage: "Asking the AI to visualize \"{eventName}\"...",
    visFunFactMessage: "This can take a moment. While you wait, here's a fun fact:",
    buttonAskWhileWaiting: "Ask AstroChat while you wait",
    visResultTitle: "AI Visualization:",
    timeUnitYear1: "Year 1",
    timeUnitYears: "Years",
    timeUnitThousand: "Thousand",
    timeUnitMillion: "Million",
    timeUnitBillion: "Billion",
    astroChatGreeting: "Greetings! I am AstroChat AI. Ask me anything about the vast, wondrous universe. What cosmic mystery is on your mind today?",
    errorApiKeyNotFoundTitle: 'API Key Not Found',
    errorApiKeyNotFoundMessage: 'The Gemini API key is missing. Please ensure it is configured as API_KEY in your environment (e.g., in Vercel settings).',
    errorInitializationFailedTitle: 'Initialization Failed',
    errorUnexpectedErrorMessage: 'An unexpected error occurred:',
    errorUnknownErrorTitle: 'Unknown Error',
    errorUnknownErrorMessage: 'An unknown error occurred during initialization.',
    errorAuthErrorTitle: 'Authentication Error',
    errorAuthErrorMessage: 'Your Gemini API key appears to be invalid or has expired. Please check your credentials.',
    errorFailedToSendTitle: 'Message Failed to Send',
    errorCosmicAnomaly: 'A cosmic anomaly occurred:',
    errorGenerationFailedTitle: 'Generation Failed',
    errorGenerationFailed: 'The AI failed to generate the visualization. Error:',
    events: [
      { 
        time: 1, 
        name: 'The Big Bang', 
        description: 'The universe erupts from a singularity of infinite density. A period of exponential \'inflation\' occurs, expanding spacetime faster than light and laying the foundation for all future structures.',
        visualizationPrompt: 'The visualization begins in absolute nothingness, a pure black canvas. Suddenly, a single point of infinitesimally small, infinitely bright white light appears and, in a fraction of an instant, explodes outward not as shrapnel, but as the fabric of space itself expanding at an unbelievable rate. This **Inflation** fills the rapidly growing canvas with a chaotic, superheated, and opaque soup of fundamental particles, visualized as a swirling, high-energy plasma of vibrant magentas, electric blues, and scorching whites. Within this roiling sea of energy, countless tiny, flickering points representing quarks and electrons dart and annihilate, creating a scene of pure, untamed cosmic energy before the universe began to cool and structure could form.',
        funFacts: [
          "The Big Bang wasn't an explosion *in* space, but rather the expansion *of* space itself everywhere at once.",
          "For a tiny fraction of a second, the universe expanded faster than the speed of light during a period called Cosmic Inflation.",
          "Everything in the entire known universe was once compressed into a space smaller than a single atom."
        ]
      },
      { 
        time: 380_000, 
        name: 'Recombination', 
        description: 'Roughly 380,000 years later, the universe cools sufficiently for electrons and protons to combine into the first neutral atoms (mostly hydrogen). This allows photons to travel freely for the first time, creating the Cosmic Microwave Background radiation we can still detect today.',
        visualizationPrompt: 'After 380,000 years of cooling, the canvas transitions from a chaotic plasma to a dense, uniform, glowing orange fog, representing a universe where light is trapped, constantly scattering off free-roaming protons and electrons. As the scene cools further, the color shifts from orange to a deep red. Then, a fundamental change sweeps across the view: the tiny electron points are captured by the larger proton points, forming neutral hydrogen atoms. As each atom forms, the opaque fog around it instantly vanishes, rendering space transparent. This clearing happens everywhere at once, releasing the trapped light as a faint, uniform, all-sky glow—the Cosmic Microwave Background—visualized as a subtle, mottled pattern of ancient light that now permanently fills the background of the dark, transparent universe.',
        funFacts: [
          "The Cosmic Microwave Background is the 'afterglow' of the Big Bang, a fossil light that we can still detect in every direction.",
          "Before Recombination, the universe was opaque, like being inside a thick fog, because light couldn't travel far without hitting a particle.",
          "The temperature of the universe at this time was about 3,000°C, similar to the surface of a red giant star."
        ]
      },
      { 
        time: 400_000_000, 
        name: 'First Stars Ignite', 
        description: 'Gravity pulls vast clouds of primordial gas together until they collapse, triggering nuclear fusion in their cores. This ignites the very first stars, which are massive, incredibly bright, and short-lived, ending the Cosmic Dark Ages.',
        visualizationPrompt: 'The view shows a vast, dark canvas representing the "Dark Ages," filled with immense, slow-drifting, filamentary clouds of deep purple and blue hydrogen gas. Over millions of years, gravity acts as an invisible hand, causing the densest parts of these cosmic webs to slowly spiral inward and collapse into tight, spinning knots. These knots heat up, a glowing from a dull red to a brilliant white at their cores. Suddenly, the first knot reaches a critical density and temperature, erupting in a blinding flash of fierce, blue-white light as nuclear fusion ignites. This first massive star, and then others across the canvas, blasts out powerful radiation that carves glowing, ionized bubbles into the surrounding dark gas, piercing the cosmic darkness for the first time.',
        funFacts: [
            "The first stars were true giants, potentially over 100 times more massive than our Sun.",
            "These 'Population III' stars were made of almost pure hydrogen and helium, the only elements available in the early universe.",
            "They burned for only a few million years (a cosmic eye-blink) before exploding as spectacular supernovae."
        ]
      },
      { 
        time: 1_000_000_000, 
        name: 'Galaxy Formation', 
        description: 'The immense gravity of dark matter halos, combined with the gravitational pull of star clusters, begins to draw in more gas and stars. These materials merge and collide, forming the earliest protogalaxies, the building blocks of the grand galaxies we see today.',
        visualizationPrompt: 'The canvas now contains scattered clusters of brilliant blue first-generation stars and glowing nebulae, all interconnected by a faint, web-like scaffold of invisible dark matter. Pulled by gravity, these star clusters and vast clouds of gas begin to migrate along the dark matter filaments, streaming towards cosmic intersections. As they converge, they collide and merge in chaotic, gravitational dances, tearing streams of stars from one another while the combined mass begins to spin, flatten, and coalesce. This process transforms the scattered star groups into the first recognizable protogalaxies—bright, clumpy, irregular whirlpools of gas and stars with intensely active star-forming regions, establishing the foundational structures of the cosmos.',
        funFacts: [
            "Our own Milky Way is on a collision course with the Andromeda galaxy, set to merge in about 4.5 billion years.",
            "Most of a galaxy's mass is invisible Dark Matter, which provides the gravitational 'scaffolding' for stars and gas.",
            "At the heart of nearly every large galaxy, including ours, lies a supermassive black hole."
        ]
      },
      { 
        time: 9_000_000_000, 
        name: 'Solar System Forms', 
        description: 'Within a spiral arm of the burgeoning Milky Way galaxy, a giant molecular cloud collapses. At its center, our Sun is born. A swirling protoplanetary disk of leftover gas and dust around the young star gradually coalesces into the planets, moons, and asteroids of our Solar System.',
        visualizationPrompt: 'The view zooms into a swirling arm of a mature galaxy, focusing on a vibrant, multi-colored interstellar cloud of gas and dust, enriched with heavy elements from long-dead stars. This nebula begins to slowly rotate and collapse under its own gravity, flattening into a vast, glowing protoplanetary disk. The center of the disk compresses and heats up, igniting into a stable, brilliant yellow star: our Sun. In the surrounding disk, tiny dust particles begin to stick together, forming larger bodies that sweep their orbits clean, carving distinct black gaps into the spinning, luminous disk. Through a series of violent collisions and mergers, these bodies grow into large, spherical planets, settling into stable orbits to create a familiar and orderly solar system.',
        funFacts: [
            "Our Sun accounts for 99.8% of all the mass in our entire solar system.",
            "The asteroid belt between Mars and Jupiter is thought to be the rocky leftovers of a planet that failed to form due to Jupiter's immense gravity.",
            "It takes light from the Sun about 8 minutes and 20 seconds to reach Earth."
        ]
      },
      { 
        time: 10_000_000_000, 
        name: 'First Life on Earth', 
        description: 'On the young, volatile Earth, in its primordial oceans or perhaps hydrothermal vents, simple organic molecules assemble into self-replicating structures. These single-celled organisms, the first life, begin a multi-billion-year evolutionary journey.',
        visualizationPrompt: 'The camera zooms onto a molten, volcanic early Earth, a world of reddish rock and churning black oceans under a thick, hazy sky, constantly bombarded by asteroids. The view then dives beneath the turbulent ocean surface, descending to a deep-sea hydrothermal vent where plumes of chemical-rich, superheated water billow from the seafloor. In this energetic soup, simple organic molecules, visualized as small, glowing line segments, begin linking together into complex chains. These chains eventually enclose themselves within protective lipid bubbles, forming the first simple cells. These microscopic spheres, glowing with the faint light of nascent life, begin to multiply and cluster around the vents, representing the first spark of biology on a hostile, inorganic planet.',
        funFacts: [
            "For about 2 billion years, all life on Earth was microscopic.",
            "Some scientists believe the essential building blocks of life were delivered to early Earth by asteroids or comets.",
            "The oxygen in our atmosphere was produced by ancient photosynthetic bacteria over billions of years."
        ]
      },
      { 
        time: 13_800_000_000, 
        name: 'Present Day', 
        description: 'After 13.8 billion years of expansion and evolution, the universe is a vast cosmic web of galaxies, stars, and dark matter. On a small, rocky planet called Earth, humanity has emerged, capable of looking back and piecing together this grand cosmic story.',
        visualizationPrompt: 'The visualization rapidly zooms out from a vibrant, modern Earth, a blue marble with green continents and sprawling city lights on its night side. The view pulls back past our Sun and the planets, through the majestic spiral arm of the Milky Way galaxy, revealing billions of other stars. The zoom accelerates dramatically, showing our galaxy to be just one of countless others. These galaxies are not scattered randomly but are arranged in a breathtaking, web-like structure of massive superclusters and filaments, separated by immense, dark voids. The final shot is this grand cosmic web, still slowly expanding, a testament to the 13.8 billion years of cosmic evolution from a single point of light to an intricate and living universe.',
        funFacts: [
            "There are more stars in the universe than grains of sand on all the beaches on Earth.",
            "Because light takes time to travel, looking at distant galaxies is like looking back in time.",
            "The universe is not only expanding, but the rate of expansion is accelerating due to a mysterious force called Dark Energy."
        ]
      },
    ]
  },
  // =================================================================================
  // Indonesian Translations
  // =================================================================================
  id: {
    headerSubtitle: "Panduan Pribadi Anda ke Kosmos",
    inputPlaceholder: "Tanya tentang bintang, planet, galaksi...",
    welcomeToAstroChat: "Selamat Datang di AstroChat AI",
    selectLevelPrompt: "Pilih tingkat pengetahuan Anda untuk memulai perjalanan kosmik.",
    educationLevels: [
      { name: 'Elementary', description: 'Penjelasan sederhana & fakta seru' },
      { name: 'High School', description: 'Konsep yang jelas untuk pelajar' },
      { name: 'Intermediate', description: 'Jawaban teknis & mendalam' },
    ],
    promptSuggestions: [
      "Apa itu lubang hitam?",
      "Ceritakan tentang Teleskop James Webb.",
      "Bagaimana bintang dilahirkan?",
      "Jelaskan materi gelap secara sederhana.",
    ],
    timelineTitle: "Perjalanan Melalui Waktu Kosmik",
    timelineSubtitle: "Jelajahi 13,8 miliar tahun sejarah. Klik pada sebuah peristiwa untuk belajar lebih lanjut dan hasilkan visualisasi AI yang unik.",
    timelineAriaLabel: "Linimasa kosmik vertikal yang interaktif",
    timelineAriaEventHover: "Melayang di atas peristiwa:",
    timelineAriaEventSelected: "Peristiwa terpilih:",
    buttonGenerateVis: "Hasilkan Visualisasi",
    visLoadingMessage: "Meminta AI untuk memvisualisasikan \"{eventName}\"...",
    visFunFactMessage: "Ini mungkin perlu waktu sejenak. Sambil menunggu, ini fakta menarik:",
    buttonAskWhileWaiting: "Tanya AstroChat sambil menunggu",
    visResultTitle: "Visualisasi AI:",
    timeUnitYear1: "Tahun ke-1",
    timeUnitYears: "Tahun",
    timeUnitThousand: "Ribu",
    timeUnitMillion: "Juta",
    timeUnitBillion: "Miliar",
    astroChatGreeting: "Salam! Saya AstroChat AI. Tanyakan apa saja tentang alam semesta yang luas dan menakjubkan. Misteri kosmik apa yang ada di pikiran Anda hari ini?",
    errorApiKeyNotFoundTitle: 'Kunci API Tidak Ditemukan',
    errorApiKeyNotFoundMessage: 'Kunci API Gemini tidak ada. Pastikan sudah dikonfigurasi sebagai API_KEY di lingkungan Anda (misalnya, di pengaturan Vercel).',
    errorInitializationFailedTitle: 'Inisialisasi Gagal',
    errorUnexpectedErrorMessage: 'Terjadi kesalahan tak terduga:',
    errorUnknownErrorTitle: 'Kesalahan Tidak Dikenal',
    errorUnknownErrorMessage: 'Terjadi kesalahan yang tidak diketahui saat inisialisasi.',
    errorAuthErrorTitle: 'Kesalahan Otentikasi',
    errorAuthErrorMessage: 'Kunci API Gemini Anda tampaknya tidak valid atau telah kedaluwarsa. Silakan periksa kredensial Anda.',
    errorFailedToSendTitle: 'Pesan Gagal Terkirim',
    errorCosmicAnomaly: 'Terjadi anomali kosmik:',
    errorGenerationFailedTitle: 'Generasi Gagal',
    errorGenerationFailed: 'AI gagal menghasilkan visualisasi. Kesalahan:',
    events: [
      { 
        time: 1, 
        name: 'Ledakan Dahsyat (Big Bang)', 
        description: 'Alam semesta meledak dari singularitas dengan kepadatan tak terbatas. Terjadi periode \'inflasi\' eksponensial, memperluas ruang-waktu lebih cepat dari cahaya dan meletakkan dasar bagi semua struktur di masa depan.',
        visualizationPrompt: 'Visualisasi dimulai dalam ketiadaan mutlak, kanvas hitam pekat. Tiba-tiba, satu titik cahaya putih yang sangat kecil dan terang tak terhingga muncul dan, dalam sekejap, meledak keluar bukan sebagai pecahan, tetapi sebagai jalinan ruang itu sendiri yang mengembang dengan kecepatan luar biasa. **Inflasi** ini mengisi kanvas yang berkembang pesat dengan sup partikel fundamental yang kacau, super panas, dan buram, divisualisasikan sebagai plasma berenergi tinggi yang berputar-putar dari warna magenta yang cerah, biru elektrik, dan putih yang membakar. Di dalam lautan energi yang bergejolak ini, titik-titik kecil yang tak terhitung jumlahnya yang mewakili quark dan elektron melesat dan saling memusnahkan, menciptakan pemandangan energi kosmik murni yang liar sebelum alam semesta mulai mendingin dan struktur dapat terbentuk.',
        funFacts: [
          "Big Bang bukanlah ledakan *di* dalam ruang, melainkan perluasan *dari* ruang itu sendiri di mana-mana sekaligus.",
          "Selama sepersekian detik, alam semesta mengembang lebih cepat dari kecepatan cahaya selama periode yang disebut Inflasi Kosmik.",
          "Segala sesuatu di seluruh alam semesta yang diketahui pernah terkompresi ke dalam ruang yang lebih kecil dari satu atom."
        ]
      },
      { 
        time: 380_000, 
        name: 'Rekombinasi', 
        description: 'Sekitar 380.000 tahun kemudian, alam semesta cukup dingin bagi elektron dan proton untuk bergabung menjadi atom netral pertama (kebanyakan hidrogen). Ini memungkinkan foton untuk melakukan perjalanan bebas untuk pertama kalinya, menciptakan radiasi Latar Belakang Gelombang Mikro Kosmik yang masih bisa kita deteksi hari ini.',
        visualizationPrompt: 'Setelah 380.000 tahun pendinginan, kanvas beralih dari plasma yang kacau menjadi kabut oranye yang padat, seragam, dan bercahaya, mewakili alam semesta di mana cahaya terperangkap, terus-menerus tersebar oleh proton dan elektron yang berkeliaran bebas. Saat pemandangan semakin dingin, warnanya bergeser dari oranye menjadi merah tua. Kemudian, perubahan mendasar menyapu pandangan: titik-titik elektron kecil ditangkap oleh titik-titik proton yang lebih besar, membentuk atom hidrogen netral. Saat setiap atom terbentuk, kabut buram di sekitarnya langsung lenyap, membuat ruang menjadi transparan. Pembersihan ini terjadi di mana-mana sekaligus, melepaskan cahaya yang terperangkap sebagai cahaya redup, seragam, di seluruh langit—Latar Belakang Gelombang Mikro Kosmik—divisualisasikan sebagai pola berbintik-bintik halus dari cahaya kuno yang kini secara permanen mengisi latar belakang alam semesta yang gelap dan transparan.',
        funFacts: [
          "Latar Belakang Gelombang Mikro Kosmik adalah 'cahaya sisa' dari Big Bang, cahaya fosil yang masih bisa kita deteksi di setiap arah.",
          "Sebelum Rekombinasi, alam semesta tidak tembus cahaya, seperti berada di dalam kabut tebal, karena cahaya tidak bisa berjalan jauh tanpa menabrak partikel.",
          "Suhu alam semesta saat ini sekitar 3.000°C, mirip dengan permukaan bintang raksasa merah."
        ]
      },
      { 
        time: 400_000_000, 
        name: 'Bintang Pertama Menyala', 
        description: 'Gravitasi menarik awan gas primordial yang luas hingga runtuh, memicu fusi nuklir di intinya. Ini menyalakan bintang-bintang pertama, yang masif, sangat terang, dan berumur pendek, mengakhiri Zaman Kegelapan Kosmik.',
        visualizationPrompt: 'Pemandangan menunjukkan kanvas gelap yang luas yang mewakili "Zaman Kegelapan", diisi dengan awan gas hidrogen filamen berwarna ungu tua dan biru yang sangat besar dan melayang perlahan. Selama jutaan tahun, gravitasi bertindak sebagai tangan tak terlihat, menyebabkan bagian terpadat dari jaring kosmik ini perlahan-lahan berputar ke dalam dan runtuh menjadi simpul-simpul yang rapat dan berputar. Simpul-simpul ini memanas, bersinar dari merah kusam menjadi putih cemerlang di intinya. Tiba-tiba, simpul pertama mencapai kepadatan dan suhu kritis, meletus dalam kilatan cahaya biru-putih yang menyilaukan saat fusi nuklir menyala. Bintang masif pertama ini, dan kemudian yang lainnya di seluruh kanvas, mengeluarkan radiasi kuat yang mengukir gelembung-gelembung terionisasi yang bersinar ke dalam gas gelap di sekitarnya, menembus kegelapan kosmik untuk pertama kalinya.',
        funFacts: [
            "Bintang-bintang pertama adalah raksasa sejati, berpotensi lebih dari 100 kali lebih masif dari Matahari kita.",
            "Bintang 'Populasi III' ini terbuat dari hidrogen dan helium yang hampir murni, satu-satunya elemen yang tersedia di alam semesta awal.",
            "Mereka terbakar hanya selama beberapa juta tahun (sekejap mata kosmik) sebelum meledak sebagai supernova yang spektakuler."
        ]
      },
      { 
        time: 1_000_000_000, 
        name: 'Pembentukan Galaksi', 
        description: 'Gravitasi besar dari halo materi gelap, dikombinasikan dengan tarikan gravitasi gugus bintang, mulai menarik lebih banyak gas dan bintang. Materi-materi ini bergabung dan bertabrakan, membentuk protogalaksi paling awal, blok bangunan galaksi-galaksi besar yang kita lihat hari ini.',
        visualizationPrompt: 'Kanvas sekarang berisi gugusan bintang generasi pertama berwarna biru cemerlang dan nebula yang bersinar, semuanya saling terhubung oleh perancah seperti jaring samar dari materi gelap yang tak terlihat. Ditarik oleh gravitasi, gugusan bintang dan awan gas yang luas ini mulai bermigrasi di sepanjang filamen materi gelap, mengalir menuju persimpangan kosmik. Saat mereka bertemu, mereka bertabrakan dan bergabung dalam tarian gravitasi yang kacau, merobek aliran bintang satu sama lain sementara massa gabungan mulai berputar, memipih, dan menyatu. Proses ini mengubah kelompok bintang yang tersebar menjadi protogalaksi pertama yang dapat dikenali—pusaran air gas dan bintang yang terang, tidak teratur, dengan daerah pembentuk bintang yang sangat aktif, membangun struktur dasar kosmos.',
        funFacts: [
            "Bima Sakti kita sendiri berada di jalur tabrakan dengan galaksi Andromeda, yang akan bergabung dalam waktu sekitar 4,5 miliar tahun.",
            "Sebagian besar massa galaksi adalah Materi Gelap yang tak terlihat, yang menyediakan 'perancah' gravitasi untuk bintang dan gas.",
            "Di jantung hampir setiap galaksi besar, termasuk galaksi kita, terdapat lubang hitam supermasif."
        ]
      },
      { 
        time: 9_000_000_000, 
        name: 'Tata Surya Terbentuk', 
        description: 'Di dalam lengan spiral galaksi Bima Sakti yang sedang berkembang, awan molekuler raksasa runtuh. Di pusatnya, Matahari kita lahir. Piringan protoplanet yang berputar-putar dari sisa gas dan debu di sekitar bintang muda secara bertahap menyatu menjadi planet, bulan, dan asteroid di Tata Surya kita.',
        visualizationPrompt: 'Tampilan memperbesar lengan spiral dari galaksi dewasa, berfokus pada awan antarbintang yang berwarna-warni dan bersemangat dari gas dan debu, yang diperkaya dengan unsur-unsur berat dari bintang-bintang yang telah lama mati. Nebula ini mulai perlahan berotasi dan runtuh di bawah gravitasinya sendiri, memipih menjadi piringan protoplanet yang luas dan bersinar. Pusat piringan memadat dan memanas, menyala menjadi bintang kuning yang stabil dan cemerlang: Matahari kita. Di piringan sekitarnya, partikel debu kecil mulai menempel, membentuk benda-benda yang lebih besar yang membersihkan orbitnya, mengukir celah-celah hitam yang berbeda di piringan yang berputar dan bercahaya. Melalui serangkaian tabrakan dan penggabungan yang hebat, benda-benda ini tumbuh menjadi planet-planet bulat besar, menetap di orbit yang stabil untuk menciptakan tata surya yang akrab dan teratur.',
        funFacts: [
            "Matahari kita menyumbang 99,8% dari seluruh massa di seluruh tata surya kita.",
            "Sabuk asteroid antara Mars dan Jupiter dianggap sebagai sisa-sisa batuan dari planet yang gagal terbentuk karena gravitasi Jupiter yang sangat besar.",
            "Cahaya dari Matahari membutuhkan waktu sekitar 8 menit 20 detik untuk mencapai Bumi."
        ]
      },
      { 
        time: 10_000_000_000, 
        name: 'Kehidupan Pertama di Bumi', 
        description: 'Di Bumi muda yang mudah menguap, di samudra primordialnya atau mungkin ventilasi hidrotermal, molekul organik sederhana berkumpul menjadi struktur yang dapat mereplikasi diri. Organisme bersel tunggal ini, kehidupan pertama, memulai perjalanan evolusi selama miliaran tahun.',
        visualizationPrompt: 'Kamera memperbesar Bumi awal yang cair dan vulkanik, dunia batuan kemerahan dan lautan hitam yang bergejolak di bawah langit yang tebal dan kabur, terus-menerus dibombardir oleh asteroid. Pemandangan kemudian menyelam di bawah permukaan laut yang bergolak, turun ke lubang hidrotermal di laut dalam di mana kepulan air super panas yang kaya bahan kimia mengepul dari dasar laut. Dalam sup energik ini, molekul organik sederhana, yang divisualisasikan sebagai segmen garis kecil yang bersinar, mulai terhubung menjadi rantai kompleks. Rantai ini akhirnya membungkus diri mereka dalam gelembung lipid pelindung, membentuk sel-sel sederhana pertama. Bola-bola mikroskopis ini, bersinar dengan cahaya redup kehidupan yang baru lahir, mulai berkembang biak dan berkerumun di sekitar lubang-lubang tersebut, mewakili percikan pertama biologi di planet anorganik yang tidak ramah.',
        funFacts: [
            "Selama sekitar 2 miliar tahun, semua kehidupan di Bumi berukuran mikroskopis.",
            "Beberapa ilmuwan percaya blok bangunan penting kehidupan dikirim ke Bumi awal oleh asteroid atau komet.",
            "Oksigen di atmosfer kita diproduksi oleh bakteri fotosintetik purba selama miliaran tahun."
        ]
      },
      { 
        time: 13_800_000_000, 
        name: 'Masa Kini', 
        description: 'Setelah 13,8 miliar tahun ekspansi dan evolusi, alam semesta adalah jaring kosmik yang luas dari galaksi, bintang, dan materi gelap. Di sebuah planet berbatu kecil bernama Bumi, umat manusia telah muncul, mampu melihat ke belakang dan menyatukan kisah kosmik yang agung ini.',
        visualizationPrompt: 'Visualisasi dengan cepat memperkecil dari Bumi modern yang bersemangat, sebuah kelereng biru dengan benua hijau dan lampu kota yang luas di sisi malamnya. Pemandangan ditarik kembali melewati Matahari dan planet-planet kita, melalui lengan spiral megah galaksi Bima Sakti, mengungkapkan miliaran bintang lainnya. Zoom meningkat secara dramatis, menunjukkan galaksi kita hanyalah salah satu dari banyak galaksi lainnya yang tak terhitung jumlahnya. Galaksi-galaksi ini tidak tersebar secara acak tetapi tersusun dalam struktur seperti jaring yang menakjubkan dari supergugus dan filamen masif, dipisahkan oleh kekosongan gelap yang sangat besar. Bidikan terakhir adalah jaring kosmik agung ini, yang masih perlahan mengembang, sebuah bukti dari 13,8 miliar tahun evolusi kosmik dari satu titik cahaya menjadi alam semesta yang rumit dan hidup.',
        funFacts: [
            "Ada lebih banyak bintang di alam semesta daripada butiran pasir di semua pantai di Bumi.",
            "Karena cahaya membutuhkan waktu untuk melakukan perjalanan, melihat galaksi yang jauh sama seperti melihat ke masa lalu.",
            "Alam semesta tidak hanya mengembang, tetapi laju ekspansi juga semakin cepat karena kekuatan misterius yang disebut Energi Gelap."
        ]
      },
    ]
  },
};