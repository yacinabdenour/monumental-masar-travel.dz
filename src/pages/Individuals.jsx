import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import OfferCardB2C from '@/components/OfferCardB2C';
import OfferDetailsModal from '@/components/OfferDetailsModal';
import UmrahOffersSection from '@/components/umrah/UmrahOffersSection';
import { Image } from '@/components/ui/image';

export default function Individuals() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    base44.entities.B2COffer.filter({ active: true }, '-order', 100)
      .then(o => setOffers(o || []))
      .finally(() => setLoading(false));
  }, []);

  const cats = ['all', ...Array.from(new Set(offers.map(o => o.category).filter(Boolean)))];
  const filtered = category === 'all' ? offers : offers.filter(o => o.category === category);

  return (
    <div>
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-14 pb-10 bg-foreground text-background border-b border-border">
        <Image src="https://media.base44.com/images/public/6abe5e830283c1b446e23656/84c5e7b3e_generated_image.png" fittingType="fill" className="absolute inset-0 w-full h-full object-cover" alt="رحلة جوية" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/85 via-foreground/80 to-foreground/95" />
        <div className="relative max-w-6xl mx-auto text-center">
          <span className="inline-block text-gold text-sm font-medium tracking-widest mb-2">للأفراد</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-background mb-4">خدمات الأفراد</h1>
          <p className="text-background/80 max-w-2xl mx-auto leading-relaxed">تصفّح عروض العمرة والحجوزات الفندقية والسياحة العالمية، واختر ما يناسبك ثم احجز مباشرة عبر واتساب برسالة جاهزة.</p>
        </div>
      </section>

      <UmrahOffersSection />

      {cats.length > 1 && (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-6xl mx-auto flex gap-2 flex-wrap">
            {cats.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === c ? 'bg-primary text-primary-foreground' : 'border border-border text-foreground/70 hover:border-primary/40 hover:text-primary'}`}>
                {c === 'all' ? 'الكل' : c}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-20">لا توجد عروض متاحة حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(o => <OfferCardB2C key={o.id} offer={o} onDetails={setDetails} />)}
            </div>
          )}
        </div>
      </section>

      <OfferDetailsModal offer={details} open={!!details} onClose={() => setDetails(null)} />
    </div>
  );
}