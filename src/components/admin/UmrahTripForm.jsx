import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";
const labelCls = "block text-sm font-medium text-foreground mb-1.5";

export default function UmrahTripForm({ initial, saving, onSave, onCancel }) {
  const [data, setData] = useState(() => ({
    title: '', period: '', prices: '', image: '', quint_limited: false, active: true, order: '',
    ...initial,
  }));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

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
    if (!data.period?.trim()) { setError('الفترة مطلوبة.'); return; }
    await onSave({ ...data, order: Number(data.order) || 0 });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl pr-8">{initial?.id ? 'تعديل الرحلة' : 'إضافة رحلة جديدة'}</DialogTitle>
          <DialogDescription>رحلة عمرة للأفراد</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>عنوان الرحلة *</label>
            <input className={inputCls} value={data.title || ''} onChange={e => set('title', e.target.value)} placeholder="مثال: رحلات مارس 2027" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>الفترة (تواريخ الرحلة) *</label>
            <input className={inputCls} value={data.period || ''} onChange={e => set('period', e.target.value)} placeholder="مثال: 10 و17 و22 مارس 2027" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>الأسعار (سطر لكل نوع غرفة، بصيغة: النوع: السعر)</label>
            <textarea rows={4} dir="rtl" className={inputCls} value={data.prices || ''} onChange={e => set('prices', e.target.value)} placeholder={'غرفة خماسية: 229,000 دج\nغرفة رباعية: 245,000 دج'} />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>صورة الرحلة</label>
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
              نشطة (تظهر في الموقع)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-[hsl(var(--gold))]" checked={!!data.quint_limited} onChange={e => set('quint_limited', e.target.checked)} />
              الغرف الخماسية محدودة
            </label>
          </div>
          <div>
            <label className={labelCls}>ترتيب الظهور (الأعلى يظهر أولاً)</label>
            <input type="number" className={inputCls} value={data.order ?? ''} onChange={e => set('order', e.target.value)} placeholder="مثال: 10" />
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