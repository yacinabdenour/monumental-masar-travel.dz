import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';
import WhatsAppIcon from './WhatsAppIcon';
import TikTokIcon from './TikTokIcon';

export default function ContactSection({ compact = false }) {
  const { settings } = useSiteSettings();
  const whatsappClean = (settings.whatsapp_number || '').replace(/[^0-9]/g, '');

  const items = [
    { icon: Phone, label: 'الهاتف', value: settings.phone, href: `tel:${(settings.phone || '').replace(/\s/g, '')}` },
    { icon: WhatsAppIcon, label: 'واتساب', value: 'تواصل عبر واتساب', href: `https://wa.me/${whatsappClean}` },
    { icon: Mail, label: 'البريد الإلكتروني', value: settings.email, href: `mailto:${settings.email}` },
    { icon: Facebook, label: 'فيسبوك', value: 'صفحتنا على فيسبوك', href: settings.facebook_url },
    { icon: Instagram, label: 'انستغرام', value: 'تابعنا على انستغرام', href: settings.instagram_url },
    { icon: MapPin, label: 'الموقع', value: settings.address, href: settings.google_maps_url },
  ];
  if (settings.additional_phone) {
    items.splice(1, 0, { icon: Phone, label: 'هاتف إضافي', value: settings.additional_phone, href: `tel:${(settings.additional_phone || '').replace(/\s/g, '')}` });
  }
  if (settings.tiktok_url) {
    items.splice(items.length - 1, 0, { icon: TikTokIcon, label: 'تيك توك', value: 'تابعنا على تيك توك', href: settings.tiktok_url });
  }

  return (
    <section id="contact" className={`px-4 sm:px-6 lg:px-8 ${compact ? 'py-14' : 'py-20'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-gold text-sm font-medium tracking-widest mb-2">اتصل بنا</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">نحن هنا لخدمتكم</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">تواصلوا معنا عبر القنوات التالية، فريقنا جاهز للإجابة على جميع استفساراتكم.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <a key={i} href={it.href} target={it.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="group flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all">
                <span className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{it.label}</p>
                  <p className="font-medium text-foreground truncate">{it.value}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}