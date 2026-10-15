import React from 'react';
import { MapPin, Building2, BadgeCheck } from 'lucide-react';
import { Image } from '@/components/ui/image';
import WhatsAppIcon from './WhatsAppIcon';

export default function OfferCardB2B({ offer, onRequest }) {
  const availabilityColor =
    offer.availability === 'متاح' ? 'text-emerald-600 bg-emerald-50' :
    offer.availability === 'محدود' ? 'text-amber-600 bg-amber-50' :
    'text-muted-foreground bg-muted';

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:shadow-2xl hover:border-gold/50 transition-all duration-300">
      <div className="relative h-44 overflow-hidden">
        <Image src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        {offer.visa_type && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gold text-foreground text-xs font-bold">
            {offer.visa_type}
          </span>
        )}
        <div className="absolute bottom-3 right-3 left-3">
          <h3 className="font-display text-lg font-bold text-background drop-shadow">{offer.title}</h3>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
          {offer.destination && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {offer.destination}</span>}
          {offer.service_type && <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-primary" /> {offer.service_type}</span>}
          {offer.availability && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${availabilityColor}`}><BadgeCheck className="h-3.5 w-3.5" /> {offer.availability}</span>}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{offer.description}</p>

        <button onClick={() => onRequest(offer)}
          className="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-gold hover:text-foreground transition-colors">
          <WhatsAppIcon className="h-4 w-4" /> طلب السعر عبر WhatsApp
        </button>
      </div>
    </div>
  );
}