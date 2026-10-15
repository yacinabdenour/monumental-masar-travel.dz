import React, { useState, useEffect } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import OfferCardB2B from '@/components/OfferCardB2B';
import B2BRequestForm from '@/components/B2BRequestForm';
import { Image } from '@/components/ui/image';

export default function Agencies() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefill, setPrefill] = useState(null);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    // agency_price deliberately excluded: confidential prices never reach the public frontend
    base44.entities.B2BOffer.filter({ active: true }, { sort: '-order', limit: 100, fields: ['title', 'destination', 'description', 'visa_type', 'service_type', 'category', 'availability', 'image', 'featured'] })
      .then(res => setOffers(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  const cats = ['all', ...Array.from(new Set(offers.map(o => o.category).filter(Boolean)))];
  const filtered = category === 'all' ? offers : offers.filter(o => o.category === category);

  return (
    <div>
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-14 pb-10 bg-foreground text-background border-b border-border">
        <Image src="https://media.base44.com/images/public/6abe5e830283c1b446e23656/99d49249a_generated_image.png" fittingType="fill" className="absolute inset-0 w-full h-full object-cover" alt="اسطنبول" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/85 via-foreground/80 to-foreground/95" />
        <div className="relative max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-gold text-sm font-medium tracking-widest mb-2">
            <ShieldCheck className="h-4 w-4" /> للوكالات فقط
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">بوابة الوكالات السياحية</h1>
          <p className="text-background/75 max-w-2xl mx-auto leading-relaxed">عروض وخدمات احترافية مخصصة لوكالات السفر والسياحة. اطلب السعر عبر واتساب وسنرسل لك الأسعار والتفاصيل وشروط الاستفادة — أسعار الوكالات سرية وتُشارك مباشرة عبر واتساب فقط.</p>
        </div>
      </section>

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

      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-20">لا توجد عروض متاحة حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(o => <OfferCardB2B key={o.id} offer={o} onRequest={setPrefill} />)}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">لم تجد العرض المناسب؟</h2>
          <p className="text-muted-foreground mb-6">يمكنك تقديم طلب مخصص وسنقوم بدراسته والرد عليك.</p>
          <button onClick={() => setPrefill({})}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-gold hover:text-foreground transition-colors">
            طلب عرض مخصص للوكالات
          </button>
        </div>
      </section>

      <B2BRequestForm open={!!prefill} onOpenChange={(o) => !o && setPrefill(null)} prefillOffer={prefill && prefill.id ? prefill : null} />
    </div>
  );
}