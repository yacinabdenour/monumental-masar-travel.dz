import React from 'react';
import { Image } from '@/components/ui/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { buildWhatsAppLink, buildOfferWhatsAppMessage } from '@/lib/siteConfig';
import WhatsAppIcon from './WhatsAppIcon';

export default function OfferDetailsModal({ offer, open, onClose }) {
  const { settings } = useSiteSettings();
  if (!offer) return null;
  const includes = (offer.includes || '').split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground pr-8">{offer.title}</DialogTitle>
          <DialogDescription className="sr-only">تفاصيل العرض</DialogDescription>
        </DialogHeader>

        {offer.image && (
          <div className="relative h-56 rounded-xl overflow-hidden -mt-1">
            <Image src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm">
          {offer.destination && <span className="inline-flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /> {offer.destination}</span>}
          {offer.duration && <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4 text-primary" /> {offer.duration}</span>}
          {offer.category && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{offer.category}</span>}
        </div>

        <p className="text-foreground/80 leading-relaxed text-sm whitespace-pre-line">{offer.description}</p>

        {includes.length > 0 && (
          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-semibold text-foreground mb-3 text-sm">يشمل العرض:</h4>
            <ul className="space-y-2">
              {includes.map((inc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {inc}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div>
            <p className="text-xs text-muted-foreground">السعر</p>
            <p className="font-display text-2xl font-bold text-primary">{offer.price || 'عند الطلب'}</p>
          </div>
          <a href={buildWhatsAppLink(settings.whatsapp_number, buildOfferWhatsAppMessage(offer))} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            <WhatsAppIcon className="h-5 w-5" /> احجز الآن عبر واتساب
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}