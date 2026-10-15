import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { buildWhatsAppLink, PREPAYMENT_INFO } from '@/lib/siteConfig';
import { Building2, Landmark, Copy, Check, ArrowRight } from 'lucide-react';

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";
const labelCls = "block text-sm font-medium text-foreground mb-1.5";

const cleanPhone = (v) => (v || "").replace(/[\s\-().]/g, "").replace(/^\+/, "").replace(/^00/, "");
const isValidPhone = (v) => /^\d{9,15}$/.test(cleanPhone(v));

const paymentOptions = [
  {
    id: 'baridimob',
    icon: Landmark,
    title: 'بريدي موب',
    desc: 'تحويل عبر بريدي موب إلى الحساب البريدي الجاري.',
  },
  {
    id: 'office_or_bank',
    icon: Building2,
    title: 'الدفع في مقر الوكالة أو التحويل البنكي',
    desc: 'تسديد الدفعة المسبقة في مقر الوكالة أو عبر تحويل بنكي.',
  },
];

export default function B2BRequestForm({ open, onOpenChange, prefillOffer }) {
  const { settings } = useSiteSettings();
  const [step, setStep] = useState('details');
  const [agencyName, setAgencyName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) { setStep('details'); setAgencyName(''); setPhone(''); setWhatsapp(''); setPaymentMethod(''); setCopied(false); setErrors({}); }
  }, [open]);

  const offer = prefillOffer || {};
  const offerTitle = offer.title || 'عرض مخصص';
  const destination = offer.destination || '';

  const submitDetails = () => {
    const e = {};
    if (!agencyName.trim()) e.agencyName = 'اسم الوكالة مطلوب';
    if (!phone.trim()) e.phone = 'رقم الهاتف مطلوب';
    else if (!isValidPhone(phone)) e.phone = 'يرجى إدخال رقم هاتف صحيح (مثال: 0555012345 أو +213555012345)';
    if (!whatsapp.trim()) e.whatsapp = 'رقم WhatsApp مطلوب';
    else if (!isValidPhone(whatsapp)) e.whatsapp = 'يرجى إدخال رقم WhatsApp صحيح (مثال: 0555012345 أو +213555012345)';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setStep('payment');
  };

  const chosenOption = paymentOptions.find(o => o.id === paymentMethod);

  const copyRip = async () => {
    try {
      await navigator.clipboard.writeText(PREPAYMENT_INFO.baridimob_rip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const submitPayment = () => {
    if (!paymentMethod) {
      setErrors(prev => ({ ...prev, paymentMethod: 'يرجى اختيار طريقة الدفع المسبق' }));
      return;
    }
    const paymentLabel = chosenOption ? chosenOption.title : '';
    const ripLine = paymentMethod === 'baridimob' ? `\nرقم الحساب البريدي (RIP): ${PREPAYMENT_INFO.baridimob_rip}` : '';
    const message = `السلام عليكم، أريد الاستفسار عن سعر عرض خاص بالوكالات.\n\nاسم الوكالة: ${agencyName.trim()}\nرقم الهاتف: ${phone.trim()}\nرقم WhatsApp: ${whatsapp.trim()}\n\nالعرض المطلوب: ${offerTitle}${destination ? `\nالوجهة: ${destination}` : ''}\n\nطريقة الدفع المسبق المفضلة: ${paymentLabel}${ripLine}\n\nيرجى إرسال السعر والتفاصيل وشروط الدفع المسبق قبل الحجز.`;
    const link = buildWhatsAppLink(settings.whatsapp_number, message);
    window.open(link, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onOpenChange(false)}>
      <DialogContent className="max-w-md">
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground pr-8">طلب السعر للوكالات</DialogTitle>
              <DialogDescription>أدخل بيانات وكالتك، ثم اختر طريقة الدفع المسبق قبل الحجز.</DialogDescription>
            </DialogHeader>

            {offer.title && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">العرض المختار</p>
                  <p className="text-sm font-semibold text-foreground truncate">{offerTitle}</p>
                </div>
                {destination && (
                  <span className="text-xs text-primary font-medium whitespace-nowrap">{destination}</span>
                )}
              </div>
            )}

            <div className="space-y-4 pt-1">
              <div>
                <label htmlFor="b2b-agency-name" className={labelCls}>اسم الوكالة *</label>
                <input id="b2b-agency-name" className={inputCls} value={agencyName} onChange={e => setAgencyName(e.target.value)} placeholder="مثال: وكالة السفر التجريبية" />
                {errors.agencyName && <p className="text-xs text-destructive mt-1">{errors.agencyName}</p>}
              </div>
              <div>
                <label htmlFor="b2b-phone" className={labelCls}>رقم الهاتف *</label>
                <input id="b2b-phone" className={inputCls} dir="ltr" value={phone} onChange={e => setPhone(e.target.value)} placeholder="مثال: 0555012345" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="b2b-whatsapp" className={labelCls}>رقم WhatsApp *</label>
                <input id="b2b-whatsapp" className={inputCls} dir="ltr" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="مثال: +213555012345" />
                {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
              </div>
            </div>

            <button onClick={submitDetails}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.99] transition-all">
              متابعة لاختيار طريقة الدفع
            </button>

            <p className="text-center text-xs text-muted-foreground -mt-1 pb-1">الدفع المسبق مطلوب قبل تأكيد الحجز.</p>
          </>
        )}

        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground pr-8">طريقة الدفع المسبق</DialogTitle>
              <DialogDescription>اختر طريقة الدفع المسبق قبل الحجز، وسنفتح لك واتساب برسالة جاهزة.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {paymentOptions.map(opt => {
                const Icon = opt.icon;
                const selected = paymentMethod === opt.id;
                return (
                  <button key={opt.id} type="button" onClick={() => { setPaymentMethod(opt.id); setErrors(prev => ({ ...prev, paymentMethod: undefined })); }}
                    className={`w-full text-right rounded-2xl border p-4 flex items-start gap-3 transition-all ${selected ? 'border-primary bg-primary/5 ring-2 ring-primary/30' : 'border-border bg-background hover:border-primary/40'}`}>
                    <span className={`mt-0.5 inline-flex h-10 w-10 shrink-0 rounded-xl items-center justify-center ${selected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-foreground text-sm">{opt.title}</span>
                      <span className="block text-xs text-muted-foreground leading-relaxed mt-1">{opt.desc}</span>
                    </span>
                  </button>
                );
              })}
              {errors.paymentMethod && <p className="text-xs text-destructive">{errors.paymentMethod}</p>}

              {paymentMethod === 'baridimob' && (
                <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4">
                  <p className="text-xs text-muted-foreground mb-1.5">رقم الحساب البريدي الجاري (RIP)</p>
                  <div className="flex items-center justify-between gap-3">
                    <span dir="ltr" className="font-display font-bold text-foreground tracking-wide text-base">{PREPAYMENT_INFO.baridimob_rip}</span>
                    <button onClick={copyRip}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-medium text-foreground hover:border-primary/40 transition-colors">
                      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'تم النسخ' : 'نسخ'}
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'office_or_bank' && (
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">سيتم تنسيق تفاصيل الدفع في المقر أو معلومات التحويل البنكي معكم عبر واتساب.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button onClick={submitPayment}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.99] transition-all">
                <WhatsAppIcon className="h-5 w-5" />
                تأكيد ومتابعة عبر WhatsApp
              </button>
              <button onClick={() => setStep('details')}
                className="w-full inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors">
                <ArrowRight className="h-4 w-4" />
                رجوع لتعديل البيانات
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground -mt-1 pb-1">سيتم فتح واتساب برسالة جاهزة تتضمن طريقة الدفع — راجعها ثم أرسلها بنفسك.</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}