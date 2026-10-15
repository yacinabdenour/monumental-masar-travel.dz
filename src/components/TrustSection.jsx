import React from 'react';
import { Headset, Zap, Compass, Handshake, Eye, RefreshCw } from 'lucide-react';

const reasons = [
  { icon: Headset, title: 'خدمة احترافية', desc: 'فريق متخصص يرافقكم في كل خطوة من رحلتكم بكل احترافية واهتمام.' },
  { icon: Zap, title: 'استجابة سريعة', desc: 'نرد على استفساراتكم وطلباتكم في أسرع وقت ممكن عبر قنوات التواصل المختلفة.' },
  { icon: Compass, title: 'خبرة سياحية', desc: 'معرفة دقيقة بالوجهات والإجراءات والتأشيرات لضمان رحلة سلسة ومريحة.' },
  { icon: Handshake, title: 'دعم مخصص للوكالات', desc: 'شراكة موثوقة مع الوكالات السياحية بعروض وأسعار تنافسية ومتابعة مستمرة.' },
  { icon: Eye, title: 'عملية شفافة', desc: 'تفاصيل واضحة وأسعار معلنة دون رسوم خفية، ثقتكم أولويتنا.' },
  { icon: RefreshCw, title: 'متابعة موثوقة', desc: 'متابعة دقيقة لكل طلب وعرض من البداية حتى النهاية لضمان رضاكم التام.' },
];

export default function TrustSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-background to-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-gold text-sm font-medium tracking-widest mb-2">لماذا المسار</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">أسباب تجعلنا خياركم الأمثل</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">نلتزم بأعلى معايير الجودة والشفافية لخدمة الأفراد والوكالات على حد سواء.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="group p-7 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-xl transition-all">
                <span className="inline-flex h-14 w-14 rounded-2xl bg-primary/10 text-primary items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{r.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}