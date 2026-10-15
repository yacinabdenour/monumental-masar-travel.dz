import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { buildWhatsAppLink } from '@/lib/siteConfig';

export default function UmrahVisaCard({ service }) {
  const { settings } = useSiteSettings();
  const message = `السلام عليكم، أريد الاستفسار عن خدمة: ${service.title}.\n\nيرجى تزويدي بالتفاصيل والمستندات المطلوبة.`;
  const waHref = buildWhatsAppLink(settings.whatsapp_number, message);

  return (
    <article className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row">
      <div className="sm:w-44 shrink-0 bg-foreground flex items-center justify-center">
        <Image src={service.image} fittingType="fill" className="w-full h-44 sm:h-full object-cover" alt={service.title} />
      </div>
      <div className="flex-1 p-6 flex flex-col gap-3">
        <h3 className="font-display text-lg font-bold text-foreground">{service.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>

        {service.prices && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {service.prices.map(p => (
              <div key={p.label} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2">
                <span className="text-xs text-muted-foreground">{p.label}</span>
                <span className="font-display text-sm font-bold text-primary whitespace-nowrap">{p.value}</span>
              </div>
            ))}
          </div>
        )}

        {service.points && (
          <ul className="space-y-1.5">
            {service.points.map(pt => (
              <li key={pt} className="flex items-center gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {pt}
              </li>
            ))}
          </ul>
        )}

        <a href={waHref} target="_blank" rel="noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
          <WhatsAppIcon className="h-5 w-5" /> استفسر عبر واتساب
        </a>
      </div>
    </article>
  );
}