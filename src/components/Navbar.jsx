import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { LOGO_URL } from '@/lib/siteConfig';
import { useSiteSettings } from '@/lib/useSiteSettings';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const links = [
  { to: '/', label: 'الرئيسية' },
  { to: '/individuals', label: 'خدمات الأفراد' },
  { to: '/agencies', label: 'خدمات الوكالات' },
  { to: '/contact', label: 'اتصل بنا' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();
  const waHref = `https://wa.me/${(settings.whatsapp_number || '').replace(/[^0-9]/g, '')}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md border-b border-border/60 shadow-sm' : 'bg-background/70 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={LOGO_URL} alt="المسار" className="h-14 w-14 object-contain rounded-xl bg-white/40 p-0.5" />
            <div className="leading-tight hidden sm:block">
              <span className="font-display text-2xl font-bold text-primary block">المسار</span>
              <span className="text-[11px] text-muted-foreground tracking-wide">تأشيرات العمرة والحجوزات الفندقية</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to ? 'text-primary bg-primary/5' : 'text-foreground/70 hover:text-primary hover:bg-primary/5'}`}>
                {l.label}
              </Link>
            ))}
            <a href={waHref} target="_blank" rel="noreferrer"
              className="mr-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <WhatsAppIcon className="h-4 w-4" /> واتساب
            </a>
          </nav>

          <button className="md:hidden p-2 rounded-lg hover:bg-primary/5" onClick={() => setOpen(!open)} aria-label="القائمة">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="px-4 py-3 space-y-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`block px-4 py-3 rounded-lg text-sm font-medium ${location.pathname === l.to ? 'text-primary bg-primary/5' : 'text-foreground/80'}`}>
                {l.label}
              </Link>
            ))}
            <a href={waHref} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground">
              <WhatsAppIcon className="h-4 w-4" /> تواصل عبر واتساب
            </a>
          </div>
        </div>
      )}
    </header>
  );
}