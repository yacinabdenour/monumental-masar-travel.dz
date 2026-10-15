import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import OfferForm from './OfferForm';

export default function B2COfferManager() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | {} (new) | record
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const items = await base44.entities.B2COffer.list('-created_date', 100);
      setOffers(items || []);
    } catch (e) { setOffers([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async (data) => {
    setSaving(true);
    try {
      if (editing?.id) await base44.entities.B2COffer.update(editing.id, data);
      else await base44.entities.B2COffer.create(data);
      setEditing(null); await load();
    } finally { setSaving(false); }
  };

  const toggle = async (o, field) => {
    await base44.entities.B2COffer.update(o.id, { [field]: !o[field] });
    load();
  };

  const remove = async (o) => {
    if (!confirm(`حذف عرض "${o.title}"؟`)) return;
    await base44.entities.B2COffer.delete(o.id);
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">عروض الأفراد (B2C)</h2>
        <button onClick={() => setEditing({})} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> إضافة عرض
        </button>
      </div>

      {offers.length === 0 ? (
        <p className="text-muted-foreground text-sm py-10 text-center">لا توجد عروض بعد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map(o => (
            <div key={o.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="h-36 overflow-hidden relative">
                {o.image ? <Image src={o.image} alt={o.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted" />}
                {!o.active && <span className="absolute inset-0 bg-background/60 flex items-center justify-center text-sm font-medium text-foreground">غير نشط</span>}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground text-sm">{o.title}</h3>
                  {o.featured && <Star className="h-4 w-4 text-gold fill-gold shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{o.destination} • {o.price || 'عند الطلب'}</p>
                <div className="flex items-center gap-2 mt-4">
                  <button onClick={() => setEditing(o)} className="p-2 rounded-lg border border-border hover:text-primary hover:border-primary/40 transition-colors"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => toggle(o, 'active')} title="تفعيل/إيقاف" className="p-2 rounded-lg border border-border hover:text-primary hover:border-primary/40 transition-colors">{o.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                  <button onClick={() => toggle(o, 'featured')} title="تمييز" className="p-2 rounded-lg border border-border hover:text-gold hover:border-gold/40 transition-colors"><Star className={`h-4 w-4 ${o.featured ? 'fill-gold text-gold' : ''}`} /></button>
                  <button onClick={() => remove(o)} className="p-2 rounded-lg border border-border hover:text-destructive hover:border-destructive/40 transition-colors mr-auto"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <OfferForm type="b2c" initial={editing.id ? editing : null} saving={saving} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  );
}