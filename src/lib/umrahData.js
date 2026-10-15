// بيانات مشتركة لعرض عروض العمرة (الفنادق والمدة معروضة في بطاقات الرحلات)
export const umrahShared = {
  duration: "14 يومًا",
  makkah: "فندق ديار أجياد — 11 ليلة",
  madinah: "فندق إعمار طيبة — 3 ليالٍ",
  airline: "رحلات مباشرة مع الخطوط السعودية (Saudia)",
};

export const umrahVisaServices = [
  {
    id: "umrah-visa-individuals",
    title: "تأشيرة العمرة للأفراد",
    image: "https://media.base44.com/images/public/6abe5e830283c1b446e23656/cdc5e458d_generated_image.png",
    description: "بأسعار مميزة وخدمات متكاملة — إمكانية حجز التذكرة مؤقتًا مع الخطوط السعودية، وإجراءات سريعة ومضمونة مع متابعة على مدار الساعة.",
    prices: [
      { label: "عبر منصة نصك (NUSUK)", value: "39,000 دج" },
      { label: "إلى 15 يوم", value: "42,000 دج" },
      { label: "من 15 إلى 20 يوم", value: "44,000 دج" },
      { label: "من 20 إلى 30 يوم", value: "47,000 دج" },
      { label: "من 30 إلى 45 يوم", value: "51,000 دج" },
      { label: "من 45 إلى 60 يوم", value: "54,000 دج" },
      { label: "من 60 إلى 90 يوم", value: "63,000 دج" },
    ],
  },
  {
    id: "saudi-visa-services",
    title: "خدمات التأشيرات السعودية",
    image: "https://media.base44.com/images/public/6abe5e830283c1b446e23656/82fe8e908_generated_image.png",
    description: "تأشيرة سياحية لاكتشاف المملكة (السياحة، الفعاليات، زيارة الأهل والمقيمين)، وتأشيرة عمرة لأداء مناسك العمرة، وتأشيرة ترانزيت للعبور عبر المملكة.",
    points: ["إجراءات ميسّرة", "مواعيد قصيرة في الإنجاز", "متابعة مستمرة"],
  },
];