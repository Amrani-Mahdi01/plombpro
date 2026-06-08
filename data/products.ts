export type Locale = "fr" | "ar";

export type Product = {
  id: string;
  name: Record<Locale, string>;
  price: number;
  oldPrice?: number;
  category: string;
  subcategory: string;
  brand: string;
  image: string;
  status?: "new" | "low" | "out";
  spec?: string;
  colors?: string[];
};

export type Category = { key: string; subs: string[] };

export const BRANDS: string[] = [
  "GROHE",
  "BOSCH",
  "STANLEY",
  "MAKITA",
  "GEBERIT",
  "WAVIN",
  "DEWALT",
  "KÄRCHER",
];

// Swatch colors for products that have finish/color options.
export const COLOR_HEX: Record<string, string> = {
  chrome: "#B8BDC4",
  inox: "#9AA1A9",
  noir: "#1F2227",
  laiton: "#B08D3C",
  cuivre: "#B87333",
  blanc: "#EDEFF2",
  anthracite: "#3A3F44",
  rouge: "#C0392B",
  jaune: "#F2B100",
  bleu: "#2563EB",
};

export const CATEGORIES: Category[] = [
  { key: "outils", subs: ["cles", "coupetubes", "couteaux", "etancheite"] },
  { key: "robinetterie", subs: ["mitigeurs", "robinets", "douche"] },
  { key: "tuyaux", subs: ["per", "pvc", "cuivre", "raccords"] },
  { key: "chauffage", subs: ["chauffeeau", "radiateurs", "pompes", "vannes"] },
  { key: "sanitaire", subs: ["kitsdouche", "accessoires"] },
];

export const PRODUCTS: Product[] = [
  { id: "p1", name: { fr: "Clé à molette professionnelle 250 mm", ar: "مفتاح إنجليزي احترافي 250 مم" }, price: 1200, category: "outils", subcategory: "cles", brand: "STANLEY", image: "/products/new-0.jpg", status: "new", spec: "250 mm" },
  { id: "p2", name: { fr: "Clé serre-tube 14\" en acier", ar: "مفتاح ربط أنابيب 14 بوصة فولاذي" }, price: 2100, category: "outils", subcategory: "cles", brand: "STANLEY", image: "/products/new-4.jpg", spec: "14\"" },
  { id: "p3", name: { fr: "Coupe-tube cuivre 3–28 mm", ar: "قاطع أنابيب نحاسية 3–28 مم" }, price: 1500, category: "outils", subcategory: "coupetubes", brand: "BOSCH", image: "/products/new-2.jpg", spec: "3–28 mm" },
  { id: "p4", name: { fr: "Couteau utilitaire rétractable 18 mm", ar: "سكين متعدد الاستعمالات 18 مم" }, price: 450, category: "outils", subcategory: "couteaux", brand: "STANLEY", image: "/products/knives-0.jpg", status: "new", spec: "18 mm", colors: ["rouge", "noir", "jaune"] },
  { id: "p5", name: { fr: "Lames trapézoïdales de rechange (×10)", ar: "شفرات بديلة شبه منحرفة (×10)" }, price: 250, category: "outils", subcategory: "couteaux", brand: "STANLEY", image: "/products/knives-1.jpg", spec: "×10" },
  { id: "p6", name: { fr: "Couteau pliant multifonction", ar: "سكين قابل للطي متعدد الوظائف" }, price: 1200, category: "outils", subcategory: "couteaux", brand: "DEWALT", image: "/products/knives-4.jpg" },
  { id: "p7", name: { fr: "Ruban Téflon PTFE (lot de 10)", ar: "شريط تيفلون PTFE (علبة 10)" }, price: 250, category: "outils", subcategory: "etancheite", brand: "WAVIN", image: "/products/new-3.jpg", spec: "×10" },
  { id: "p8", name: { fr: "Set de joints d'étanchéité (120 pcs)", ar: "طقم حشوات إحكام (120 قطعة)" }, price: 600, category: "outils", subcategory: "etancheite", brand: "WAVIN", image: "/products/promo-5.jpg", spec: "120 pcs" },
  { id: "p9", name: { fr: "Mitigeur de cuisine chromé col haut", ar: "خلاط مطبخ كروم بعنق مرتفع" }, price: 3500, category: "robinetterie", subcategory: "mitigeurs", brand: "GROHE", image: "/products/new-1.jpg", colors: ["chrome", "noir", "laiton"] },
  { id: "p10", name: { fr: "Mitigeur de lavabo chromé", ar: "خلاط مغسلة كروم" }, price: 2900, category: "robinetterie", subcategory: "mitigeurs", brand: "GROHE", image: "/hero/hero-faucet.jpg", status: "new", colors: ["chrome", "noir"] },
  { id: "p11", name: { fr: "Robinet d'arrêt en laiton 1/2\"", ar: "محبس مياه نحاسي 1/2 بوصة" }, price: 680, category: "robinetterie", subcategory: "robinets", brand: "GEBERIT", image: "/products/new-5.jpg", spec: "Ø 1/2\"", colors: ["laiton", "chrome"] },
  { id: "p12", name: { fr: "Colonne de douche encastrable", ar: "عمود دش للتركيب" }, price: 4200, oldPrice: 6000, category: "robinetterie", subcategory: "douche", brand: "GROHE", image: "/products/promo-2.jpg", colors: ["chrome", "noir"] },
  { id: "p13", name: { fr: "Tube PER 16 mm (rouleau 25 m)", ar: "أنبوب PER 16 مم (لفة 25 م)" }, price: 2800, category: "tuyaux", subcategory: "per", brand: "WAVIN", image: "/products/plumbing-0.jpg", spec: "16 mm" },
  { id: "p14", name: { fr: "Raccord PVC évacuation Ø40", ar: "وصلة PVC للصرف Ø40" }, price: 180, category: "tuyaux", subcategory: "pvc", brand: "WAVIN", image: "/products/plumbing-1.jpg", spec: "Ø40" },
  { id: "p15", name: { fr: "Tube cuivre Ø18 (2 m)", ar: "أنبوب نحاس Ø18 (2 م)" }, price: 3200, category: "tuyaux", subcategory: "cuivre", brand: "WAVIN", image: "/products/plumbing-0.jpg", spec: "Ø18" },
  { id: "p16", name: { fr: "Collier de serrage inox (lot de 20)", ar: "أطواق تثبيت ستانلس (علبة 20)" }, price: 450, category: "tuyaux", subcategory: "raccords", brand: "STANLEY", image: "/products/plumbing-4.jpg", spec: "×20" },
  { id: "p17", name: { fr: "Chauffe-eau électrique 50 L", ar: "سخان مياه كهربائي 50 لتر" }, price: 18900, oldPrice: 24900, category: "chauffage", subcategory: "chauffeeau", brand: "BOSCH", image: "/products/promo-0.jpg", spec: "50 L" },
  { id: "p18", name: { fr: "Chauffe-eau 100 L vertical", ar: "سخان مياه عمودي 100 لتر" }, price: 26900, category: "chauffage", subcategory: "chauffeeau", brand: "BOSCH", image: "/products/promo-0.jpg", status: "new", spec: "100 L" },
  { id: "p19", name: { fr: "Radiateur acier panneau 600×1200", ar: "مشع حراري فولاذي 600×1200" }, price: 11500, category: "chauffage", subcategory: "radiateurs", brand: "GEBERIT", image: "/products/plumbing-2.jpg", spec: "600×1200", colors: ["blanc", "anthracite"] },
  { id: "p20", name: { fr: "Pompe à eau auto-amorçante 0,5 CV", ar: "مضخة مياه ذاتية السحب 0.5 حصان" }, price: 9500, oldPrice: 12000, category: "chauffage", subcategory: "pompes", brand: "KÄRCHER", image: "/products/promo-1.jpg", spec: "0,5 CV" },
  { id: "p21", name: { fr: "Vanne thermostatique radiateur 1/2\"", ar: "صمام ترموستاتي للمشع 1/2 بوصة" }, price: 1350, category: "chauffage", subcategory: "vannes", brand: "GEBERIT", image: "/products/plumbing-3.jpg", status: "low", spec: "Ø 1/2\"" },
  { id: "p22", name: { fr: "Manomètre de pression 0–4 bar", ar: "مانومتر ضغط 0–4 بار" }, price: 1100, category: "chauffage", subcategory: "vannes", brand: "BOSCH", image: "/products/plumbing-5.jpg", spec: "0–4 bar" },
  { id: "p23", name: { fr: "Kit de douche complet inox", ar: "طقم دش كامل ستانلس" }, price: 4200, category: "sanitaire", subcategory: "kitsdouche", brand: "GROHE", image: "/products/promo-2.jpg", colors: ["chrome", "noir", "blanc"] },
  { id: "p24", name: { fr: "Pistolet à mastic professionnel", ar: "مسدس سيليكون احترافي" }, price: 950, oldPrice: 1400, category: "sanitaire", subcategory: "accessoires", brand: "DEWALT", image: "/products/promo-3.jpg" },
  { id: "p25", name: { fr: "Détecteur de fuite électronique", ar: "كاشف تسرب إلكتروني" }, price: 3800, category: "sanitaire", subcategory: "accessoires", brand: "BOSCH", image: "/products/promo-4.jpg" },
  { id: "p26", name: { fr: "Couteau de plombier à mastic inox", ar: "سكين سباك للمعجون ستانلس" }, price: 600, category: "sanitaire", subcategory: "accessoires", brand: "STANLEY", image: "/products/knives-3.jpg", status: "out", spec: "Inox" },
];
