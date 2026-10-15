import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plane, Hotel, Globe2, Building2, ShieldCheck, FileCheck, ClipboardCheck, Handshake } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import TrustSection from '@/components/TrustSection';
import ContactSection from '@/components/ContactSection';
import OfferCardB2C from '@/components/OfferCardB2C';
import OfferCardB2B from '@/components/OfferCardB2B';
import OfferDetailsModal from '@/components/OfferDetailsModal';
import { Image } from '@/components/ui/image';
import B2BRequestForm from '@/components/B2BRequestForm';
import HomeHero from '@/components/HomeHero';

const services = [
  { icon: Plane, title: 'تأشيرات العمرة', desc: 'إصدار تأشيرات العمرة بأسرع وقت وفق الإجراءات المعتمدة.' },
  { icon: Hotel, title: 'حجوزات فندقية', desc: 'حجوزات فندقية مختارة قرب الحرمين بأسعار تنافسية.' },
  { icon: Globe2, title: 'سياحة دولية', desc: 'عروض سياحية إلى أبرز الوجهات العالمية باحترافية.' },
  { icon: Building2, title: 'خدمات الوكالات', desc: 'شراكة موثوقة مع الوكالات السياحية بعروض وأسعار خاصة.' },
];

const processSteps = [
  { icon: ClipboardCheck, title: 'اختر العرض', desc: 'تصفّح عروض الوكالات واختر ما يناسب عملاءك.' },
  { icon: FileCheck, title: 'اطلب السعر', desc: 'أرسل طلبك عبر واتساب ببيانات وكالتك والعرض المطلوب.' },
  { icon: ShieldCheck, title: 'نرسل لك الأسعار', desc: 'نتواصل معك عبر واتساب بالسعر والتفاصيل وشروط الاستفادة.' },
  { icon: Handshake, title: 'نؤكد الشراكة', desc: 'نتفق على الشروط ونبدأ العمل معاً.' },
];

export default function Home() {
  const [b2c, setB2c] = useState([]);
  const [b2b, setB2b] = useState([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [b2bPrefill, setB2bPrefill] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [c, bRes] = await Promise.all([
          base44.entities.B2COffer.filter({ active: true }, '-order', 12),
          // agency_price deliberately excluded: confidential prices never reach the public frontend
          base44.entities.B2BOffer.filter({ active: true }, { sort: '-order', limit: 12, fields: ['title', 'destination', 'description', 'visa_type', 'service_type', 'category', 'availability', 'image', 'featured'] }),
        ]);
        const b = bRes.items || [];
        const pick = (arr) => {
          const f = (arr || []).filter(o => o.featured);
          return (f.length ? f : (arr || [])).slice(0, 3);
        };
        setB2c(pick(c));
        setB2b(pick(b));
      } catch (e) {}
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div>
      <HomeHero />

      {/* Services overview */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-gold text-sm font-medium tracking-widest mb-2">خدماتنا</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">حلول سفر متكاملة</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="p-7 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-xl transition-all text-center">
                  <span className="inline-flex h-14 w-14 rounded-2xl bg-primary/10 text-primary items-center justify-center mb-4"><Icon className="h-7 w-7" /></span>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured B2C */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="inline-block text-gold text-sm font-medium tracking-widest mb-2">للأفراد</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">عروض مميزة</h2>
            </div>
            <Link to="/individuals" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">عرض الكل <ArrowLeft className="h-4 w-4" /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[0,1,2].map(i => <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />)}</div>
          ) : b2c.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {b2c.map(o => <OfferCardB2C key={o.id} offer={o} onDetails={setDetails} />)}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">ستظهر العروض المميزة هنا قريباً.</p>
          )}
        </div>
      </section>

      {/* Featured B2B */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="inline-block text-gold text-sm font-medium tracking-widest mb-2">للوكالات</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">عروض الوكالات</h2>
            </div>
            <Link to="/agencies" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">بوابة الوكالات <ArrowLeft className="h-4 w-4" /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[0,1,2].map(i => <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />)}</div>
          ) : b2b.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {b2b.map(o => <OfferCardB2B key={o.id} offer={o} onRequest={setB2bPrefill} />)}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">ستظهر عروض الوكالات هنا قريباً.</p>
          )}
        </div>
      </section>

      <TrustSection />

      {/* B2B Process */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-gold text-sm font-medium tracking-widest mb-2">كيف نعمل</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">آلية الشراكة مع الوكالات</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">عملية واضحة ومنظمة من اختيار العرض إلى تأكيد الشراكة.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative p-6 rounded-2xl border border-border bg-card">
                  <span className="absolute top-5 left-5 font-display text-3xl font-bold text-primary/15">{i + 1}</span>
                  <span className="inline-flex h-12 w-12 rounded-xl bg-primary/10 text-primary items-center justify-center mb-4"><Icon className="h-6 w-6" /></span>
                  <h3 className="font-display font-semibold text-foreground mb-1.5">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative">
          <Image src="https://media.base44.com/images/public/6abe5e830283c1b446e23656/1d8b5038e_generated_image.png" fittingType="fill" className="absolute inset-0 w-full h-full object-cover" alt="الحرم المكي" />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/80 to-primary/70" />
          <div className="relative p-10 md:p-16 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-background mb-4">جاهزون لبدء رحلتكم؟</h2>
            <p className="text-background/80 max-w-xl mx-auto mb-8">سواء كنتم أفراداً تبحثون عن عرض، أو وكالة تبحثون عن شراكة موثوقة — نحن هنا لخدمتكم.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/individuals" className="px-7 py-3 rounded-xl bg-gold text-foreground font-semibold hover:bg-gold/90 transition-colors">خدمات الأفراد</Link>
              <Link to="/agencies" className="px-7 py-3 rounded-xl border border-background/40 text-background font-semibold hover:bg-background hover:text-foreground transition-colors">خدمات الوكالات</Link>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />

      <OfferDetailsModal offer={details} open={!!details} onClose={() => setDetails(null)} />
      <B2BRequestForm open={!!b2bPrefill} onOpenChange={(o) => !o && setB2bPrefill(null)} prefillOffer={b2bPrefill} />
    </div>
  );
}