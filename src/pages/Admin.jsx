import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Plane, Moon, Building2, Inbox, Settings, LogOut, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import B2COfferManager from '@/components/admin/B2COfferManager';
import UmrahTripManager from '@/components/admin/UmrahTripManager';
import B2BOfferManager from '@/components/admin/B2BOfferManager';
import RequestManager from '@/components/admin/RequestManager';
import SettingsManager from '@/components/admin/SettingsManager';
import TeamManager from '@/components/admin/TeamManager';
import { LOGO_URL } from '@/lib/siteConfig';

const tabs = [
  { key: 'b2c', label: 'عروض الأفراد', icon: Plane },
  { key: 'umrah', label: 'رحلات العمرة', icon: Moon },
  { key: 'b2b', label: 'عروض الوكالات', icon: Building2 },
  { key: 'requests', label: 'طلبات الوكالات', icon: Inbox },
  { key: 'settings', label: 'الإعدادات', icon: Settings },
  { key: 'team', label: 'فريق الإدارة', icon: Users },
];

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('b2c');

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">غير مصرح بالوصول</h1>
          <p className="text-muted-foreground text-sm">هذه الصفحة مخصصة لمديري الموقع فقط.</p>
          <Link to="/" className="inline-block mt-4 text-sm text-primary hover:underline">العودة إلى الرئيسية</Link>
        </div>
      </div>
    );
  }

  const logout = async () => {
    await base44.auth.logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="المسار" className="h-10 w-10 object-contain rounded-lg bg-white/60 p-0.5" />
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">لوحة التحكم</h1>
              <p className="text-xs text-muted-foreground">إدارة محتوى موقع المسار</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors">عرض الموقع</Link>
            <button onClick={logout} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground/70 hover:text-destructive hover:border-destructive/40 transition-colors">
              <LogOut className="h-4 w-4" /> خروج
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${tab === t.key ? 'bg-primary text-primary-foreground' : 'border border-border text-foreground/70 hover:border-primary/40 hover:text-primary'}`}>
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'b2c' && <B2COfferManager />}
        {tab === 'umrah' && <UmrahTripManager />}
        {tab === 'b2b' && <B2BOfferManager />}
        {tab === 'requests' && <RequestManager />}
        {tab === 'settings' && <SettingsManager />}
        {tab === 'team' && <TeamManager />}
      </div>
    </div>
  );
}