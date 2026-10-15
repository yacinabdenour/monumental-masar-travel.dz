import React, { useState, useEffect } from 'react';
import UmrahOfferCard from '@/components/umrah/UmrahOfferCard';
import UmrahVisaCard from '@/components/umrah/UmrahVisaCard';
import { umrahVisaServices, umrahShared } from '@/lib/umrahData';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';

export const parsePrices = (text) => (text || '').split('\n').map(l => l.trim()).filter(Boolean).map(line => {
  const i = line.indexOf(':');
  return i > 0 ? { type: line.slice(0, i).trim(), value: line.slice(i + 1).trim() } : { type: line, value: '' };
});

export default function UmrahOffersSection() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.UmrahTrip.filter({ active: true }, { sort: '-order', limit: 50 })
      .then(res => setTrips((res.items || []).map(t => ({ ...t, prices: parsePrices(t.prices) }))))
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-gold text-sm font-medium tracking-widest mb-2">برامج كاملة مع الخطوط السعودية</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">عروض العمرة</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            برامج عمرة {umrahShared.duration}: إقامة 11 ليلة في {umrahShared.makkah.split(' — ')[0]} بمكة المكرمة، و3 ليالٍ في {umrahShared.madinah.split(' — ')[0]} بالمدينة المنورة. الأسعار للشخص الواحد حسب نوع الغرفة.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {trips.map(o => <UmrahOfferCard key={o.id} offer={o} />)}
            {trips.length === 0 && <p className="text-muted-foreground text-center py-10">لا توجد رحلات متاحة حالياً.</p>}
          </div>
        )}

        <div className="mt-16">
          <div className="text-center mb-8">
            <span className="inline-block text-gold text-sm font-medium tracking-widest mb-2">بأسعار مميزة</span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">خدمات التأشيرات</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {umrahVisaServices.map(v => <UmrahVisaCard key={v.id} service={v} />)}
          </div>
        </div>
      </div>
    </section>
  );
}