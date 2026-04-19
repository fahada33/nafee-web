"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";

// ─── Mock data ───────────────────────────────────────────────────
const user = { name: "أحمد" };

const portfolio = {
  monthlyIncome:  2850,
  monthlyChange:  12.4,
  annualIncome:   34200,
  nextDistDate:   "15 مارس 2026",
  totalInvested:  150000,
  portfolioValue: 168500,
  annualReturn:   11.4,
};

const recentOpps = [
  { id: "1", title: "برج العليا التجاري",  type: "مكاتب تجارية",  return: 12, funded: 68, image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70&fit=crop" },
  { id: "4", title: "مركز لوجستي الشمال", type: "مستودعات",       return: 14, funded: 22, image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=70&fit=crop" },
  { id: "5", title: "مول التجمع",          type: "تجزئة تجارية",  return: 11, funded: 80, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=70&fit=crop" },
];

const myInvestments = [
  { title: "برج الأعمال",  monthly: 1360, return: 12, status: "نشط" },
  { title: "فيلا بريميوم", monthly: 563,  return: 9,  status: "نشط" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "صباح الخير";
  if (h < 18) return "مساء الخير";
  return "مساء النور";
}

export default function HomePage() {
  return (
    <AppShell>
      <div className="min-h-screen bg-[#f5f5f5] pb-24 lg:pb-8 font-[family-name:var(--font-tajawal)]">

        {/* ══ Header ══════════════════════════════════════════════ */}
        <div className="bg-white px-5 lg:px-8 pt-12 lg:pt-8 pb-5 flex items-center justify-between border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 leading-none">{greeting()}،</p>
            <h1 className="text-[26px] font-extrabold text-[#1a1a1a] flex items-center gap-1.5 mt-1 leading-none">
              {user.name} <span className="text-2xl">👋</span>
            </h1>
          </div>
          <button className="relative w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>

        <div className="px-4 lg:px-8 pt-4 lg:pt-6 flex flex-col gap-4 max-w-6xl lg:mx-0">

          {/* Desktop: 2-column grid wrapper */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-6 flex flex-col gap-4">

          {/* LEFT column on desktop */}
          <div className="lg:col-span-2 flex flex-col gap-4">

          {/* ══ Monthly Passive Income Card ═════════════════════ */}
          <div className="relative bg-[#2d7b33] rounded-3xl p-6 overflow-hidden shadow-lg shadow-[#2d7b33]/20">
            {/* Background blobs */}
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-white/[0.07]" />
            <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-white/[0.07]" />
            <div className="absolute top-6 left-24 w-20 h-20 rounded-full bg-white/[0.05]" />

            <div className="relative z-10">
              {/* Top row */}
              <div className="flex items-start justify-between mb-2">
                <p className="text-white/55 text-[10px] font-bold uppercase tracking-[0.15em]">
                  الدخل الشهري السلبي
                </p>
                <span className="bg-white/[0.18] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  +{portfolio.monthlyChange}%
                </span>
              </div>

              {/* Big amount */}
              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-[52px] font-extrabold text-white leading-none tracking-tight">
                  {portfolio.monthlyIncome.toLocaleString()}
                </span>
                <span className="text-white/55 text-lg font-medium mb-1">ريال</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.18] mb-4" />

              {/* Annual income + Next distribution */}
              <div className="grid grid-cols-2">
                <div className="border-l border-white/[0.18] pl-4">
                  <p className="text-white/50 text-[10px] uppercase tracking-wide mb-1">الدخل السنوي</p>
                  <p className="text-white font-extrabold text-[17px] leading-none">
                    {portfolio.annualIncome.toLocaleString()} <span className="text-sm font-medium opacity-60">ريال</span>
                  </p>
                </div>
                <div className="pr-4">
                  <p className="text-white/50 text-[10px] uppercase tracking-wide mb-1 flex items-center gap-1">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    التوزيع القادم
                  </p>
                  <p className="text-white font-extrabold text-[17px] leading-none">{portfolio.nextDistDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ══ 3 KPI Tiles ════════════════════════════════════ */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white rounded-2xl px-3 py-4 text-center shadow-sm">
              <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide leading-snug mb-2">
                إجمالي<br/>المستثمر
              </p>
              <p className="text-[17px] font-extrabold text-[#1a1a1a] leading-none">
                {(portfolio.totalInvested / 1000).toFixed(0)}K
              </p>
              <p className="text-[10px] text-gray-400 mt-1">ريال</p>
            </div>
            <div className="bg-white rounded-2xl px-3 py-4 text-center shadow-sm">
              <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide leading-snug mb-2">
                قيمة<br/>المحفظة
              </p>
              <p className="text-[17px] font-extrabold text-[#1a1a1a] leading-none">
                {(portfolio.portfolioValue / 1000).toFixed(1)}K
              </p>
              <p className="text-[10px] text-gray-400 mt-1">ريال</p>
            </div>
            <div className="bg-white rounded-2xl px-3 py-4 text-center shadow-sm">
              <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide leading-snug mb-2">
                العائد<br/>السنوي
              </p>
              <p className="text-[17px] font-extrabold text-[#2d7b33] leading-none">
                {portfolio.annualReturn}%
              </p>
              <p className="text-[10px] text-gray-400 mt-1">سنوياً</p>
            </div>
          </div>

          {/* ══ My Investments ═════════════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-sm font-extrabold text-[#1a1a1a]">استثماراتي</p>
              <Link href="/portfolio" className="text-xs text-[#2d7b33] font-semibold">عرض الكل</Link>
            </div>
            <div className="flex flex-col gap-2">
              {myInvestments.map((inv) => (
                <div key={inv.title} className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2d7b33" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2"/>
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1a1a1a] truncate">{inv.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">عائد {inv.return}% · شهري</p>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <p className="text-sm font-extrabold text-[#2d7b33]">{inv.monthly.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">ريال/شهر</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ══ Available Opportunities ════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-sm font-extrabold text-[#1a1a1a]">فرص متاحة</p>
              <Link href="/opportunities" className="text-xs text-[#2d7b33] font-semibold">عرض الكل</Link>
            </div>
            {/* Mobile: horizontal scroll. Desktop: grid */}
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible scrollbar-hide">
              {recentOpps.map((opp) => (
                <Link key={opp.id} href={`/opportunities/${opp.id}`} className="flex-shrink-0 w-[180px] lg:w-auto">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.97]">
                    <div className="relative h-[110px] lg:h-36 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={opp.image} alt={opp.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                        {opp.type}
                      </span>
                      <p className="absolute bottom-2 right-2 left-2 text-white font-bold text-xs leading-tight line-clamp-2">
                        {opp.title}
                      </p>
                    </div>
                    <div className="px-3 py-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[#2d7b33] font-extrabold text-sm">{opp.return}%</span>
                        <span className="text-[10px] text-gray-400">{opp.funded}% ممول</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-1 overflow-hidden">
                        <div className="bg-[#2d7b33] h-1 rounded-full" style={{ width: `${opp.funded}%` }} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ══ Quick Actions ══════════════════════════════════ */}
          <div className="grid grid-cols-2 gap-2.5 pb-2 lg:hidden">
            <Link href="/wallet" className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <path d="M20 12V8a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-4"/>
                  <path d="M20 12a2 2 0 00-2-2h-2a2 2 0 000 4h2a2 2 0 002-2z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1a1a1a]">المحفظة</p>
                <p className="text-xs text-gray-400">شحن وسحب</p>
              </div>
            </Link>
            <Link href="/portfolio" className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2d7b33" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1a1a1a]">محفظتي</p>
                <p className="text-xs text-gray-400">تتبع الأداء</p>
              </div>
            </Link>
          </div>

          </div>{/* end LEFT col */}

          {/* RIGHT column on desktop — KPIs + quick links */}
          <div className="hidden lg:flex flex-col gap-4">

            {/* Mini portfolio card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">ملخص المحفظة</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "إجمالي المستثمر",  value: `${(portfolio.totalInvested/1000).toFixed(0)}K ريال`,  color: "" },
                  { label: "قيمة المحفظة",     value: `${(portfolio.portfolioValue/1000).toFixed(1)}K ريال`, color: "" },
                  { label: "العائد السنوي",     value: `${portfolio.annualReturn}%`,                          color: "text-[#2d7b33]" },
                  { label: "الدخل السنوي",      value: `${portfolio.annualIncome.toLocaleString()} ريال`,     color: "" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-400">{row.label}</span>
                    <span className={`text-sm font-extrabold ${row.color || "text-[#1a1a1a]"}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">إجراءات سريعة</p>
              <div className="flex flex-col gap-2">
                {[
                  { href: "/wallet",       label: "شحن المحفظة",    sub: "إضافة رصيد",        bg: "bg-blue-50",    stroke: "#3b82f6" },
                  { href: "/wallet",       label: "سحب الأرباح",    sub: "تحويل للبنك",       bg: "bg-orange-50",  stroke: "#f97316" },
                  { href: "/portfolio",    label: "تتبع الأداء",    sub: "محفظتي الاستثمارية", bg: "bg-[#e8f5e9]",  stroke: "#2d7b33" },
                  { href: "/opportunities",label: "استكشاف الفرص",  sub: "فرص جديدة",         bg: "bg-purple-50",  stroke: "#8b5cf6" },
                ].map((item) => (
                  <Link key={item.href + item.label} href={item.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.stroke} strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a1a]">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Next distribution */}
            <div className="bg-[#e8f5e9] rounded-2xl p-5">
              <p className="text-xs font-bold text-[#2d7b33] uppercase tracking-wide mb-2">التوزيع القادم</p>
              <p className="text-xl font-extrabold text-[#1a1a1a]">{portfolio.nextDistDate}</p>
              <p className="text-sm text-gray-500 mt-1">{portfolio.monthlyIncome.toLocaleString()} ريال متوقعة</p>
            </div>

          </div>{/* end RIGHT col */}

          </div>{/* end desktop grid */}

        </div>
      </div>
    </AppShell>
  );
}
