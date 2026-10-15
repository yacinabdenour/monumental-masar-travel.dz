import React, { useState, useEffect } from 'react';
import { Loader2, FileText, Download, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const STATUS = {
  pending: { label: 'قيد المراجعة', cls: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
  accepted: { label: 'تم قبول الطلب', cls: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  rejected: { label: 'تم رفض الطلب', cls: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  completed: { label: 'مكتمل', cls: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
};

export default function RequestManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [signing, setSigning] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const items = await base44.entities.B2BRequest.list('-created_date', 200);
      setRequests(items || []);
    } catch (e) { setRequests([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    await base44.entities.B2BRequest.update(id, { status });
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status } : r));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };

  const viewDoc = async (req) => {
    if (!req.rc_file_uri) return;
    setSigning(true);
    try {
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: req.rc_file_uri });
      window.open(signed_url, '_blank');
    } catch (e) { alert('تعذّر فتح المستند.'); }
    finally { setSigning(false); }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">طلبات الوكالات</h2>
      <p className="text-muted-foreground text-sm mb-6">إدارة ومراجعة طلبات الوكالات الشريكة وتغيير حالتها.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'border border-border text-foreground/70 hover:border-primary/40'}`}>الكل ({requests.length})</button>
        {Object.entries(STATUS).map(([k, v]) => {
          const count = requests.filter(r => r.status === k).length;
          return (
            <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === k ? 'bg-primary text-primary-foreground' : 'border border-border text-foreground/70 hover:border-primary/40'}`}>
              {v.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm py-10 text-center">لا توجد طلبات.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${STATUS[r.status]?.dot}`} />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{r.agency_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.offer} • {r.destination}</p>
                </div>
              </div>
              <span className="font-mono text-xs text-primary font-bold tracking-wider" dir="ltr">{r.reference_number}</span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS[r.status]?.cls}`}>{STATUS[r.status]?.label}</span>
              <button onClick={() => setSelected(r)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors">تفاصيل</button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <Dialog open onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl pr-8">طلب {selected.reference_number}</DialogTitle>
              <DialogDescription>تفاصيل طلب الوكالة</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                ['اسم الوكالة', selected.agency_name],
                ['اسم المسؤول', selected.contact_name],
                ['الهاتف', selected.phone],
                ['البريد الإلكتروني', selected.email],
                ['الخدمة', selected.service],
                ['العرض', selected.offer],
                ['الوجهة', selected.destination],
                ['عدد المسافرين', selected.travelers],
                ['تاريخ السفر', selected.travel_date],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-medium text-foreground">{v || '—'}</p>
                </div>
              ))}
              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground">ملاحظات</p>
                <p className="font-medium text-foreground whitespace-pre-line">{selected.notes || '—'}</p>
              </div>
            </div>

            {selected.rc_file_uri && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                <FileText className="h-8 w-8 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{selected.rc_file_name || 'السجل التجاري'}</p>
                  <p className="text-xs text-muted-foreground">وثيقة خاصة — مخزّنة بشكل آمن</p>
                </div>
                <button onClick={() => viewDoc(selected)} disabled={signing} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  {signing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} عرض
                </button>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-foreground mb-2">تغيير الحالة</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(STATUS).map(([k, v]) => (
                  <button key={k} onClick={() => changeStatus(selected.id, k)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selected.status === k ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground/70 hover:border-primary/40'}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}