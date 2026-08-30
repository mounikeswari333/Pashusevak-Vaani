import { useEffect, useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../types/language';
import useTranslate from '../hooks/useTranslate';
import { useTranslation } from 'react-i18next';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

const logo =
  'https://id-preview--bb7debd9-3ec1-4854-b983-f61eb0ded53a.lovable.app/__l5e/assets-v1/3ba28a89-d3ee-4516-be83-96fccbe646e1/logo.png';

const navLinks = [
  { href: '#news', label: 'News' },
  { href: '#schemes', label: 'Schemes' },
  { href: '#startups', label: 'Startups' },
  { href: '#editorial', label: 'Editorial' },
  { href: '#newsletter', label: 'Subscribe' },
];

const drawerLinks = [
  { href: '/admin', label: 'Admin' },
  ...navLinks,
  { href: '#about', label: 'About Us' },
  { href: '#help', label: 'Help' },
  { href: '/join-us', label: 'Join Us' },
];

export function TopBar() {
  const { language } = useLanguage();

  return (
    <div style={{ backgroundColor: '#6F450E', color: '#fffdf7' }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-1.5 text-[11px]">
        <div className="flex items-center gap-4 font-mono uppercase tracking-widest opacity-90">
          <span className="hidden sm:inline">
            {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

function getDisplayName(u: any) {
  if (!u) return '';
  const meta = u.user_metadata || {};
  const name = meta.full_name || meta.name || u.email || '';
  const part = String(name).split(/[@.\s_\-]+/)[0] || '';
  return part ? part.charAt(0).toUpperCase() + part.slice(1) : '';
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSignOutPopup, setShowSignOutPopup] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = useTranslate();
  const { t: staticT } = useTranslation();
  const { user, signInWithGoogle, signOut } = useSupabaseAuth();
  const router = useRouter();
  const label = language === 'hi' ? 'Hindi' : 'English';
  const adminHref = '/admin';

  useEffect(() => {
    if (!showSignOutPopup) return;

    const timer = window.setTimeout(() => setShowSignOutPopup(false), 3000);
    return () => window.clearTimeout(timer);
  }, [showSignOutPopup]);

  useEffect(() => {
    if (!user) {
      setProfileOpen(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setShowSignOutPopup(true);
  };

  const getUserName = () => {
    const displayName = getDisplayName(user);
    if (displayName) return displayName;

    if (!user?.email) return '';

    const localPart = String(user.email).split('@')[0] || '';
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  };

  return (
    <nav
      className="sticky top-0 z-50 shadow-sm "
      style={{
        backgroundColor: '#9dbb0b',
        borderBottom: '2px solid #6f450e',
        height: '90px',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.navigate({ to: '/' })}
            className="flex min-w-0 items-center gap-2 sm:gap-3 leading-none bg-none border-none cursor-pointer"
          >
            <img
              src="https://id-preview--bb7debd9-3ec1-4854-b983-f61eb0ded53a.lovable.app/__l5e/assets-v1/3ba28a89-d3ee-4516-be83-96fccbe646e1/logo.png"
              alt="PashuSevak Vaani logo"
              className="h-10 w-10 shrink-0 rounded-md object-contain sm:h-17 sm:w-18"
              style={{ backgroundColor: '#fffdf7' }}
            />
            <div className="flex min-w-0 flex-col">
              <span
                className="font-hi text-sm font-bold leading-tight sm:text-base"
                style={{ color: '#6f450e' }}
              >
                पशुसेवक वाणी
              </span>
              <span
                className="font-sans text-[9px] font-bold uppercase tracking-[0.15em] leading-tight"
                style={{ color: '#6f450e' }}
              >
                PashuSevak Vaani
              </span>
            </div>
          </button>
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-sans uppercase tracking-[0.18em]"
              style={{
                borderColor: '#6f450e55',
                backgroundColor: '#6F450E',
                color: 'white',
              }}
            >
              {label}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <path d="M2 3.5l3 3 3-3" />
              </svg>
            </button>
            {langOpen ? (
              <div
                className="absolute left-0 top-full z-50 mt-2 w-32 overflow-hidden rounded-xl border shadow-xl"
                style={{
                  backgroundColor: '#fffdf7',
                  borderColor: '#9dbb0b33',
                  boxShadow: '0 10px 30px #6f450e15',
                }}
              >
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'Hindi' },
                ].map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLanguage(opt.code as Language);
                      setLangOpen(false);
                    }}
                    className="block cursor-pointer w-full px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.18em]"
                    style={{ color: '#6f450e' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div
          className="hidden items-center gap-5 font-sans text-[12px] font-semibold uppercase tracking-widest lg:flex"
          style={{ color: '#6f450e' }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-extrabold transition-opacity hover:opacity-70"
            >
              {staticT(l.label)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/join-us"
            className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-widest shadow-sm sm:px-4 sm:py-2 sm:text-[11px]"
            style={{ backgroundColor: '#6f450e', color: '#fffdf7' }}
          >
            {staticT('Join Us')}
          </Link>

          <Link
            to={adminHref}
            className="ml-2 hidden sm:inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-widest shadow-sm sm:px-4 sm:py-2 sm:text-[11px]"
            style={{ backgroundColor: '#F8C21B', color: '#6f450e', border: '1px solid #6f450e' }}
          >
            Admin
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-transparent bg-[#6f450e] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#fffdf7] shadow-sm transition hover:border-[#fffdf7] sm:px-4 sm:py-2 sm:text-[11px]"
              >
                <span className="hidden sm:inline">Welcome, {getUserName()}!</span>
                <span className="inline sm:hidden">{getUserName()}</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M2 3.5l3 3 3-3" />
                </svg>
              </button>

              {profileOpen ? (
                <div
                  className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-2xl border bg-[#fffdf7] shadow-xl"
                  style={{ borderColor: '#9dbb0b', color: '#6f450e' }}
                >
                  <button
                    onClick={async () => {
                      await handleSignOut();
                      setProfileOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] transition hover:bg-[#f6f5eb]"
                    style={{ color: '#6f450e' }}
                  >
                    {staticT('Sign Out')}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-widest shadow-sm sm:px-3 sm:py-1.5 sm:text-[10px]"
              style={{ backgroundColor: '#6f450e', color: '#fffdf7' }}
            >
              {staticT('Sign In')}
            </button>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid cursor-pointer size-9 place-items-center rounded-md border-3"
            style={{ color: '#F8C21B', borderColor: '#6f450e' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div>
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          // overlay (right side) should be yellow when menu open
          style={{ backgroundColor: '#F8C21B' }}
          onClick={() => setOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-full transform transition duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ borderRight: '1px solid #6F450E', backgroundColor: '#9DBB0B' }}
        >
          <div
            className="relative flex items-center justify-between gap-3 border-b px-5 py-4"
            style={{ borderColor: '#6F450E', backgroundColor: '#6F450E' }}
          >
            <div className="relative flex items-center gap-2">
              <span
                className="font-sans text-sm font-bold uppercase tracking-[0.18em]"
                style={{ color: '#F8C21B' }}
              >
                {staticT('Menu')}
              </span>
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="rounded-full bg-[#F8C21B] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6F450E]"
              >
                {label}
              </button>
              {langOpen ? (
                <div className="absolute left-0 top-full z-50 mt-2 w-44 rounded-3xl border border-[#6f450e33] bg-[#fffdf7] p-2 shadow-xl">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'Hindi' },
                  ].map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLanguage(opt.code as Language);
                        setLangOpen(false);
                      }}
                      className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.18em] transition hover:bg-[#f2f1e5]"
                      style={{ color: '#6f450e' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid cursor-pointer h-9 w-9 place-items-center rounded-md border"
              style={{ color: '#F8C21B', borderColor: '#6f450e55', backgroundColor: '#6F450E' }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="px-5 py-4" style={{ backgroundColor: '#9DBB0B' }}>
            <nav className="space-y-2">
              {drawerLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block cursor-pointer rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-[#fffdf7]"
                  style={{ color: '#6f450e' }}
                >
                  {staticT(item.label)}
                </a>
              ))}
            </nav>
          </div>
          {/* drawer footer with logo */}
          <div className="mt-auto px-5 py-4" style={{ backgroundColor: '#9DBB0B' }}>
            <a href="/" onClick={() => setOpen(false)}>
              <img src={logo} alt="PashuSevak Vaani" className="h-16 w-auto" />
            </a>
          </div>
        </div>
      </div>

      {showSignOutPopup && (
        <div
          aria-live="polite"
          className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-lg px-6 py-3 shadow-lg"
          style={{ backgroundColor: '#4CAF50', color: '#fff' }}
        >
          <p className="text-sm font-semibold">Sign Out Successful</p>
        </div>
      )}
    </nav>
  );
}
