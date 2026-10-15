import React from 'react';
import { MapPin, Clock, ArrowLeft } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { buildWhatsAppLink, buildOfferWhatsAppMessage } from '@/lib/siteConfig';
import WhatsAppIcon from './WhatsAppIcon';

export default function OfferCardB2C({ offer, onDetails }) {
  const { settings } = useSiteSettings();

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
      <div className="relative h-52 overflow-hidden cursor-pointer" onClick={() => onDetails(offer)}>
        <Image src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {offer.category && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-medium text-primary">
            {offer.category}
          </span>
        )}
        <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-gold text-foreground text-sm font-bold shadow">
          {offer.price || 'عند الطلب'}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-display text-xl font-bold text-foreground mb-2">{offer.title}</h3>
        {offer.destination && (
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
            <MapPin className="h-4 w-4 text-primary" /> {offer.destination}
          </div>
        )}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{offer.description}</p>

        {offer.duration && (
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-4">
            <Clock className="h-4 w-4" /> {offer.duration}
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <button onClick={() => onDetails(offer)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors">
            التفاصيل
          </button>
          <a href={buildWhatsAppLink(settings.whatsapp_number, buildOfferWhatsAppMessage(offer))} target="_blank" rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            <WhatsAppIcon className="h-4 w-4" /> اطلب هذه الخدمة
          </a>
        </div>
      </div>
    </div>
  );
}