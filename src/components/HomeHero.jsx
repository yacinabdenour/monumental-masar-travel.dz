import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Image } from '@/components/ui/image';

const options = [
  {
    to: '/agencies',
    eyebrow: 'للوكالات فقط',
    title: 'خدمات الوكالات السياحية',
    desc: 'عروض وخدمات حصرية مصممة للمهنيين ووكالات السفر.',
    cta: 'استكشف خدمات الوكالات',
    img: 'https://media.base44.com/images/public/6abe5e830283c1b446e23656/99d49249a_generated_image.png',
    bgClass: 'absolute inset-0 bg-gradient-to-tl from-foreground/85 via-gold/40 to-foreground/70',
    eyebrowClass: 'bg-gold/95 text-foreground',
    ctaClass: 'bg-gold text-foreground group-hover:bg-gold/90',
  },
  {
    to: '/individuals',
    eyebrow: 'للأفراد',
    title: 'خدمات الأفراد',
    desc: 'اكتشف عروض السفر والعمرة والفنادق وتذاكر الطيران.',
    cta: 'اكتشف عروض الأفراد',
    img: 'https://media.base44.com/images/public/6abe5e830283c1b446e23656/582f183bf_generated_image.png',
    bgClass: 'absolute inset-0 bg-gradient-to-tl from-foreground/85 via-primary/40 to-foreground/70',
    eyebrowClass: 'bg-primary/95 text-primary-foreground',
    ctaClass: 'bg-primary text-primary-foreground group-hover:bg-primary/90',
  },
];

const pills = ['مرونة في الحجز', 'متابعة دقيقة للطلبات', 'استجابة سريعة عبر واتساب'];

export default function HomeHero() {
  return (
    <section>
      {/* Cinematic hero */}
      <div className="relative h-[68vh] min-h-[500px] w-full overflow-hidden">
        <Image src="https://media.base44.com/images/public/6abe5e830283c1b446e23656/1d8b5038e_generated_image.png" fittingType="fill" className="absolute inset-0 w-full h-full object-cover" alt="الكعبة المشرفة" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/75 via-foreground/70 to-foreground" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <span className="text-gold text-xs sm:text-sm font-medium tracking-[0.3em] mb-4">المسار — تأشيرات العمرة والحجوزات الفندقية</span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-background leading-tight mb-5">رحلتك تبدأ من هنا</h1>
          <p className="text-background/85 max-w-2xl text-base sm:text-lg leading-relaxed mb-7">
            منصة واحدة تخدم وكالات السفر والأفراد معاً — عروض العمرة، الحجوزات الفندقية، التأشيرات والرحلات، مع استفسار وحجز مباشر عبر واتساب.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {pills.map(p => (
              <span key={p} className="px-4 py-1.5 rounded-full bg-background/10 backdrop-blur-sm text-background/90 text-xs font-medium border border-background/15">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Overlapping service selection */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {options.map(o => (
            <Link key={o.to} to={o.to}
              className="group relative flex flex-col justify-end overflow-hidden rounded-3xl h-72 sm:h-80 shadow-2xl ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <div className="absolute inset-0">
                <Image src={o.img} fittingType="fill" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={o.title} />
                <div className={o.bgClass} />
              </div>
              <div className="relative p-7 sm:p-8">
                <span className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold ${o.eyebrowClass}`}>{o.eyebrow}</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-background mb-2">{o.title}</h2>
                <p className="text-background/80 text-sm sm:text-base leading-relaxed mb-5 max-w-sm">{o.desc}</p>
                <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${o.ctaClass}`}>
                  {o.cta}
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}