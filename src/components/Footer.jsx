import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { LOGO_URL } from '@/lib/siteConfig';
import { useSiteSettings } from '@/lib/useSiteSettings';
import WhatsAppIcon from './WhatsAppIcon';
import TikTokIcon from './TikTokIcon';

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-foreground text-background/90 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="المسار" className="h-14 w-14 object-contain rounded-xl bg-white/90 p-1" />
              <span className="font-display text-2xl font-bold text-background">المسار</span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              {settings.about_text}
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-background/70 hover:text-gold transition-colors">الرئيسية</Link></li>
              <li><Link to="/individuals" className="text-background/70 hover:text-gold transition-colors">خدمات الأفراد</Link></li>
              <li><Link to="/agencies" className="text-background/70 hover:text-gold transition-colors">خدمات الوكالات</Link></li>
              <li><Link to="/contact" className="text-background/70 hover:text-gold transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-sm">
              <li><a href={`tel:${(settings.phone || '').replace(/\s/g, '')}`} className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors"><Phone className="h-4 w-4" /> {settings.phone}</a></li>
              {settings.additional_phone && (
                <li><a href={`tel:${(settings.additional_phone || '').replace(/\s/g, '')}`} className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors"><Phone className="h-4 w-4" /> {settings.additional_phone}</a></li>
              )}
              <li><a href={`https://wa.me/${(settings.whatsapp_number || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors"><WhatsAppIcon className="h-4 w-4" /> واتساب</a></li>
              <li><a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors"><Mail className="h-4 w-4" /> {settings.email}</a></li>
              <li><a href={settings.google_maps_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors"><MapPin className="h-4 w-4" /> {settings.address}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-4">تابعنا</h4>
            <div className="flex items-center gap-3">
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="فيسبوك" className="h-10 w-10 rounded-full bg-background/10 hover:bg-gold hover:text-foreground flex items-center justify-center transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="انستغرام" className="h-10 w-10 rounded-full bg-background/10 hover:bg-gold hover:text-foreground flex items-center justify-center transition-colors"><Instagram className="h-5 w-5" /></a>
              {settings.tiktok_url && (
                <a href={settings.tiktok_url} target="_blank" rel="noreferrer" aria-label="تيك توك" className="h-10 w-10 rounded-full bg-background/10 hover:bg-gold hover:text-foreground flex items-center justify-center transition-colors"><TikTokIcon className="h-5 w-5" /></a>
              )}
              <a href={`https://wa.me/${(settings.whatsapp_number || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" aria-label="واتساب" className="h-10 w-10 rounded-full bg-background/10 hover:bg-gold hover:text-foreground flex items-center justify-center transition-colors"><WhatsAppIcon className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/50">© {new Date().getFullYear()} المسار — جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-background/50">تأشيرات العمرة والحجوزات الفندقية</p>
            <Link to="/admin" className="text-[11px] text-background/30 hover:text-background/60 transition-colors">إدارة الموقع</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}