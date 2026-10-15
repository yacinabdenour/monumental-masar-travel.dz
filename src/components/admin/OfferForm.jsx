import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";
const labelCls = "block text-sm font-medium text-foreground mb-1.5";

const b2cFields = [
  { key: 'price', label: 'السعر', placeholder: 'مثال: 120,000 د.ج أو عند الطلب' },
  { key: 'duration', label: 'المدة', placeholder: 'مثال: 10 أيام / 7 ليالٍ' },
  { key: 'category', label: 'التصنيف', placeholder: 'مثال: عمرة، سياحة' },
];
const b2bFields = [
  { key: 'agency_price', label: 'سعر الوكالات', placeholder: 'مثال: عند الطلب' },
  { key: 'visa_type', label: 'نوع التأشيرة/الخدمة', placeholder: 'مثال: تأشيرة عمرة' },
  { key: 'service_type', label: 'نوع الخدمة', placeholder: 'مثال: حجوزات فندقية' },
  { key: 'availability', label: 'التوفر', placeholder: 'متاح / محدود / مغلق' },
  { key: 'category', label: 'التصنيف', placeholder: 'مثال: تأشيرات، حجوزات' },
];

export default function OfferForm({ type, initial, onSave, onCancel }) {
  const isB2C = type === 'b2c';
  const [data, setData] = useState(() => ({
    title: '', destination: '', description: '', image: '', active: true, featured: false, order: '',
    ...(isB2C ? { price: '', duration: '', includes: '', category: '' } : { agency_price: '', visa_type: '', service_type: '', availability: '', category: '' }),
    ...initial,
  }));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const fields = isB2C ? b2cFields : b2bFields;

  const onFile = async (f) => {
    if (!f) return;
    setUploading(true); setError('');
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file: f });
      set('image', file_url);
    } catch (e) {
      setError('فشل رفع الصورة.');
    } finally { setUploading(false); }
  };

  const submit = async () => {
    if (!data.title?.trim()) { setError('العنوان مطلوب.'); return; }
    setSaving(true); setError('');
    try {
      await onSave({ ...data, order: Number(data.order) || 0 });
    } catch (e) {
      setError('حدث خطأ أثناء الحفظ.');
    } finally { setSaving(false); }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl pr-8">{initial?.id ? 'تعديل العرض' : 'إضافة عرض جديد'}</DialogTitle>
          <DialogDescription>{isB2C ? 'عرض للأفراد (B2C)' : 'عرض للوكالات (B2B)'}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>العنوان *</label>
            <input className={inputCls} value={data.title || ''} onChange={e => set('title', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>الوجهة</label>
            <input className={inputCls} value={data.destination || ''} onChange={e => set('destination', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>ترتيب الظهور (الأعلى يظهر أولاً)</label>
            <input type="number" className={inputCls} value={data.order ?? ''} onChange={e => set('order', e.target.value)} placeholder="مثال: 10" />
          </div>
          {fields.slice(0, 1).map(f => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <input className={inputCls} value={data[f.key] || ''} placeholder={f.placeholder} onChange={e => set(f.key, e.target.value)} />
            </div>
          ))}

          {fields.slice(1).map(f => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <input className={inputCls} value={data[f.key] || ''} placeholder={f.placeholder} onChange={e => set(f.key, e.target.value)} />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className={labelCls}>الوصف</label>
            <textarea rows={3} className={inputCls} value={data.description || ''} onChange={e => set('description', e.target.value)} />
          </div>

          {isB2C && (
            <div className="sm:col-span-2">
              <label className={labelCls}>يشمل العرض (سطر لكل بند)</label>
              <textarea rows={3} className={inputCls} value={data.includes || ''} onChange={e => set('includes', e.target.value)} placeholder="الإقامة الفندقية&#10;التأشيرة&#10;النقل" />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className={labelCls}>صورة العرض</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? 'جاري الرفع...' : 'رفع صورة'}
                <input type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files?.[0])} disabled={uploading} />
              </label>
              {data.image && (
                <div className="h-16 w-24 rounded-lg overflow-hidden border border-border shrink-0">
                  <Image src={data.image} alt="معاينة" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-[hsl(var(--primary))]" checked={!!data.active} onChange={e => set('active', e.target.checked)} />
              نشط
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-[hsl(var(--primary))]" checked={!!data.featured} onChange={e => set('featured', e.target.checked)} />
              مميز (يظهر في الصفحة الرئيسية)
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-destructive mt-3">{error}</p>}

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">إلغاء</button>
          <button onClick={submit} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} حفظ
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}