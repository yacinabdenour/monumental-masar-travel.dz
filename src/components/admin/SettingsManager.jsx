import React, { useState, useEffect } from 'react';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { defaultSettings } from '@/lib/siteConfig';

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";
const labelCls = "block text-sm font-medium text-foreground mb-1.5";

const fields = [
  { key: 'whatsapp_number', label: 'رقم واتساب (دولي بدون +)', placeholder: '213600000000', dir: 'ltr' },
  { key: 'phone', label: 'رقم الهاتف', placeholder: '+213 770 00 00 00', dir: 'ltr' },
  { key: 'additional_phone', label: 'رقم هاتف إضافي', placeholder: '0697 93 23 35', dir: 'ltr' },
  { key: 'email', label: 'البريد الإلكتروني', placeholder: 'contact@masar-travel.com', dir: 'ltr' },
  { key: 'facebook_url', label: 'رابط فيسبوك', placeholder: 'https://facebook.com/...', dir: 'ltr' },
  { key: 'instagram_url', label: 'رابط انستغرام', placeholder: 'https://instagram.com/...', dir: 'ltr' },
  { key: 'tiktok_url', label: 'رابط تيك توك', placeholder: 'https://tiktok.com/@...', dir: 'ltr' },
  { key: 'google_maps_url', label: 'رابط خرائط جوجل', placeholder: 'https://maps.google.com/...', dir: 'ltr' },
  { key: 'address', label: 'العنوان', placeholder: 'المدينة، الدولة' },
];

export default function SettingsManager() {
  const [data, setData] = useState(defaultSettings);
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const items = await base44.entities.SiteSettings.list();
      if (items && items.length > 0) {
        setData({ ...defaultSettings, ...items[0] });
        setRecordId(items[0].id);
      }
    } catch (e) {}
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const set = (k, v) => { setData(d => ({ ...d, [k]: v })); setSaved(false); };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...data };
      delete payload.id;
      if (recordId) await base44.entities.SiteSettings.update(recordId, payload);
      else {
        const rec = await base44.entities.SiteSettings.create(payload);
        setRecordId(rec.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">الإعدادات ومعلومات التواصل</h2>
      <p className="text-muted-foreground text-sm mb-6">هذه القيم تُحدّث تلقائياً في جميع صفحات الموقع (الفوتر، اتصل بنا، أزرار واتساب...).</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
        {fields.map(f => (
          <div key={f.key} className={f.key === 'address' ? 'sm:col-span-2' : ''}>
            <label className={labelCls}>{f.label}</label>
            <input className={inputCls} dir={f.dir} value={data[f.key] || ''} placeholder={f.placeholder} onChange={e => set(f.key, e.target.value)} />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className={labelCls}>نبذة عن الوكالة</label>
          <textarea rows={3} className={inputCls} value={data.about_text || ''} onChange={e => set('about_text', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} حفظ الإعدادات
        </button>
        {saved && <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600"><CheckCircle2 className="h-4 w-4" /> تم الحفظ</span>}
      </div>
    </div>
  );
}