export const LOGO_URL = "https://media.base44.com/images/public/user_6ab54b764e15be6efc68b2e7/437457630_ce35ac744_photo_2026-10-01_13-43-20.jpg";

export const defaultSettings = {
  whatsapp_number: "213655033965",
  phone: "+213 655 03 39 65",
  email: "Mohamedssahebi@gmail.com",
  facebook_url: "https://www.facebook.com/profile.php?id=61584368780819&locale=ar_AR",
  instagram_url: "https://www.instagram.com/el_masssar/",
  tiktok_url: "https://www.tiktok.com/@el_massar",
  additional_phone: "0697 93 23 35",
  google_maps_url: "https://maps.google.com/?q=Mecca",
  address: "الجزائر العاصمة، الجزائر",
  about_text:
    "المسار وكالة متخصصة في تأشيرات العمرة والحجوزات الفندقية والسياحة الدينية. نوفّر خدمات احترافية للأفراد والوكالات السياحية بشفافية ومتابعة دقيقة.",
};

export const PREPAYMENT_INFO = {
  baridimob_rip: "00799999003012990538",
};

export function buildWhatsAppLink(number, message) {
  const clean = (number || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function buildOfferWhatsAppMessage(offer) {
  const price = offer.price ? `\nالسعر: ${offer.price}` : "";
  return `السلام عليكم، أريد الاستفسار عن هذه الخدمة:\n\nالخدمة: ${offer.title}\nالوجهة: ${offer.destination || "—"}${price}\n\nيرجى تزويدي بالتفاصيل المتوفرة وطريقة الحجز.`;
}