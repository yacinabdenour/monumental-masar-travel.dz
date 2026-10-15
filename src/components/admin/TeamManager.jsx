import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Users, Trash2, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const inputCls = 'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';

export default function TeamManager() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [inviting, setInviting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await base44.entities.User.list();
      setUsers(res.items || res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const invite = async () => {
    const clean = (email || '').trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      toast({ title: 'أدخل بريداً إلكترونياً صحيحاً', variant: 'destructive' });
      return;
    }
    setInviting(true);
    try {
      await base44.users.inviteUser(clean, role);
      toast({ title: role === 'admin' ? 'تم إرسال الدعوة كمدير' : 'تم إرسال الدعوة كمستخدم', description: clean });
      setEmail('');
      await loadUsers();
    } catch (e) {
      toast({ title: 'تعذر إرسال الدعوة', description: e?.message || '', variant: 'destructive' });
    } finally {
      setInviting(false);
    }
  };

  const changeRole = async (user, newRole) => {
    setBusyId(user.id);
    try {
      await base44.entities.User.update(user.id, { role: newRole });
      toast({ title: 'تم تحديث الدور' });
      await loadUsers();
    } catch (e) {
      toast({ title: 'تعذر تحديث الدور', description: e?.message || '', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  const removeUser = async (user) => {
    if (!window.confirm(`سيتم إزالة ${user.email} من التطبيق نهائياً. متابعة؟`)) return;
    setBusyId(user.id);
    try {
      await base44.entities.User.delete(user.id);
      toast({ title: 'تمت إزالة المستخدم' });
      await loadUsers();
    } catch (e) {
      toast({ title: 'تعذرت الإزالة', description: e?.message || '', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" /> إضافة عضو جديد</h3>
        <p className="text-xs text-muted-foreground mb-4">سيصل العضو بريد دعوة لتفعيل حسابه، ثم ينشئ كلمة السر الخاصة به بنفسه.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" type="email" dir="ltr" className={inputCls} />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">مدير (صلاحيات كاملة)</SelectItem>
              <SelectItem value="user">مستخدم عادي</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={invite} disabled={inviting} className="bg-primary text-primary-foreground hover:bg-primary/90 h-auto whitespace-nowrap">
            {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            إرسال الدعوة
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> أعضاء التطبيق</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">لا يوجد أعضاء بعد.</p>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between rounded-xl border border-border bg-white px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{u.full_name || '—'}</p>
                  <p className="text-xs text-muted-foreground truncate" dir="ltr">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Select value={u.role || 'user'} onValueChange={(v) => changeRole(u, v)} disabled={busyId === u.id}>
                    <SelectTrigger className="w-36 h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">مدير</SelectItem>
                      <SelectItem value="user">مستخدم عادي</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => removeUser(u)} disabled={busyId === u.id}
                    className="border-destructive/40 text-destructive hover:bg-destructive/10 h-9">
                    {busyId === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}