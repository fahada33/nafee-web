"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/home",
    label: "الرئيسية",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#2d7b33" : "none"} stroke={active ? "#2d7b33" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    href: "/opportunities",
    label: "الفرص",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d7b33" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    href: "/wallet",
    label: "المحفظة",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d7b33" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V8a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-4"/>
        <path d="M20 12a2 2 0 00-2-2h-2a2 2 0 000 4h2a2 2 0 002-2z"/>
      </svg>
    ),
  },
  {
    href: "/portfolio",
    label: "محفظتي",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d7b33" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "حسابي",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d7b33" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-[family-name:var(--font-tajawal)]">

      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <aside className="hidden lg:flex flex-col fixed top-0 right-0 h-full w-64 bg-white border-l border-gray-100 z-40">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="نافع" className="h-9 w-auto" />
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all
                  ${active
                    ? "bg-[#e8f5e9] text-[#2d7b33]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#1a1a1a]"
                  }`}
              >
                {item.icon(active)}
                <span className={`text-sm font-semibold ${active ? "text-[#2d7b33]" : ""}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="mr-auto w-1.5 h-1.5 rounded-full bg-[#2d7b33]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#2d7b33]">أ</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1a1a1a] truncate">أحمد محمد</p>
              <p className="text-xs text-gray-400 truncate">مستثمر نشط</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      {/* On mobile: full width. On desktop: offset right by sidebar width */}
      <main className="lg:mr-64 min-h-screen">

        {/* Mobile: centered 430px frame feel. Desktop: natural full width */}
        <div className="w-full lg:max-w-none mx-auto">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav (hidden on desktop) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-3 py-1"
              >
                {item.icon(active)}
                <span className={`text-xs font-medium ${active ? "text-[#2d7b33]" : "text-gray-400"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
