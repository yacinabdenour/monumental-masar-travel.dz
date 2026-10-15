import React from 'react';
import { CalendarRange, Hotel, Moon, Plane, AlertTriangle } from 'lucide-react';
import { Image } from '@/components/ui/image';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { buildWhatsAppLink } from '@/lib/siteConfig';
import { umrahShared } from '@/lib/umrahData';

export default function UmrahOfferCard({ offer }) {
  const { settings } = useSiteSettings();
  const message = `السلام عليكم، أريد الاستفسار عن عرض العمرة:\n\nالعرض: ${offer.title}\nالفترة: ${offer.period}\nالمدة: ${umrahShared.duration}\nالفنادق: ${umrahShared.makkah} / ${umrahShared.madinah}\n\nيرجى تزويدي بالتفاصيل وطريقة الحجز.`;
  const waHref = buildWhatsAppLink(settings.whatsapp_number, message);

  return (
    <article className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div>
          <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
            <h3 className="font-display text-xl font-bold text-foreground">{offer.title}</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/15 text-gold text-xs font-semibold whitespace-nowrap">
              <CalendarRange className="h-3.5 w-3.5" /> {offer.period}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">برنامج عمرة {umrahShared.duration} — الأسعار للشخص الواحد حسب نوع الغرفة</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <p className="flex items-center gap-2 text-foreground/80"><Plane className="h-4 w-4 text-primary shrink-0" /> {umrahShared.airline}</p>
          <p className="flex items-center gap-2 text-foreground/80"><Hotel className="h-4 w-4 text-primary shrink-0" /> مكة: {umrahShared.makkah}</p>
          <p className="flex items-center gap-2 text-foreground/80"><Moon className="h-4 w-4 text-primary shrink-0" /> المدينة: {umrahShared.madinah}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {offer.prices.map(p => (
            <div key={p.type} className="rounded-xl border border-border bg-background px-3 py-2.5 text-center">
              <p className="text-xs text-muted-foreground mb-0.5">{p.type}</p>
              <p className="font-display text-base sm:text-lg font-bold text-primary">{p.value}</p>
            </div>
          ))}
        </div>

        {offer.quintLimited && (
          <div className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 text-gold shrink-0" />
            <p className="text-xs font-medium text-foreground">الغرف الخماسية محدودة: <span className="font-bold">3 غرف فقط في كل رحلة</span></p>
          </div>
        )}

        <a href={waHref} target="_blank" rel="noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
          <WhatsAppIcon className="h-5 w-5" /> استفسر عبر واتساب
        </a>
      </div>
    </article>
  );
}