import React from 'react';
import ContactSection from '@/components/ContactSection';
import { useSiteSettings } from '@/lib/useSiteSettings';

export default function Contact() {
  const { settings } = useSiteSettings();
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(settings.address || 'Mecca')}&z=14&output=embed`;

  return (
    <div>
      <section className="px-4 sm:px-6 lg:px-8 pt-14 pb-10 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block text-gold text-sm font-medium tracking-widest mb-2">تواصل معنا</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">اتصل بنا</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">نسعد بخدمتكم عبر قنوات التواصل المتعددة. لا تتردد في التواصل معنا لأي استفسار.</p>
        </div>
      </section>

      <ContactSection />

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl overflow-hidden border border-border h-80">
            <iframe src={mapSrc} className="w-full h-full" style={{ border: 0 }} loading="lazy" title="موقعنا على الخريطة" />
          </div>
        </div>
      </section>
    </div>
  );
}