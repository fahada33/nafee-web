"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";

// ─── Data ────────────────────────────────────────────────────────
const summary = {
  monthlyIncome:   2850,
  yearlyIncome:    34200,
  nextDistDate:    "15 مايو 2026",
  nextDistAmount:  2850,
  totalInvested:   150000,
  portfolioValue:  168500,
  activeContracts: 3,
  avgReturn:       11.4,
};

type ContractStatus = "نشط" | "مكتمل" | "قيد التفعيل";

const contracts: {
  id: string;
  title: string;
  type: string;
  status: ContractStatus;
  monthlyIncome: number;
  yearlyIncome: number;
  invested: number;
  sharePercent: number;
  nextDist: string;
  startDate: string;
  annualReturn: number;
  image: string;
}[] = [
  {
    id: "1",
    title: "برج العليا التجاري",
    type: "مكاتب تجارية",
    status: "نشط",
    monthlyIncome: 1360,
    yearlyIncome: 16320,
    invested: 25000,
    sharePercent: 1.8,
    nextDist: "15 مايو 2026",
    startDate: "يناير 2025",
    annualReturn: 12,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=60&fit=crop",
  },
  {
    id: "3",
    title: "فيلا بريميوم",
    type: "سكني",
    status: "نشط",
    monthlyIncome: 563,
    yearlyIncome: 6756,
    invested: 75000,
    sharePercent: 3.0,
    nextDist: "1 أكتوبر 2026",
    startDate: "مارس 2024",
    annualReturn: 9,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=60&fit=crop",
  },
  {
    id: "5",
    title: "مول التجمع",
    type: "تجزئة تجارية",
    status: "نشط",
    monthlyIncome: 927,
    yearlyIncome: 11124,
    invested: 50000,
    sharePercent: 1.0,
    nextDist: "1 يونيو 2026",
    startDate: "يوليو 2025",
    annualReturn: 11,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&q=60&fit=crop",
  },
  {
    id: "2",
    title: "مجمع الواحة التجاري",
    type: "تجزئة تجارية",
    status: "مكتمل",
    monthlyIncome: 0,
    yearlyIncome: 0,
    invested: 30000,
    sharePercent: 0.8,
    nextDist: "—",
    startDate: "يناير 2022",
    annualReturn: 10,
    image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=200&q=60&fit=crop",
  },
  {
    id: "4",
    title: "مركز لوجستي الشمال",
    type: "مستودعات",
    status: "قيد التفعيل",
    monthlyIncome: 0,
    yearlyIncome: 0,
    invested: 80000,
    sharePercent: 2.2,
    nextDist: "—",
    startDate: "أبريل 2026",
    annualReturn: 14,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&q=60&fit=crop",
  },
];

// 12-month income chart data (last 12 months)
const chartMonths = ["مايو", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس", "يناير", "فبر", "مارس", "أبريل"];
const chartValues = [1200, 1200, 1750, 1750, 1750, 2313, 2313, 2313, 2313, 2850, 2850, 2850];
const chartMax = Math.max(...chartValues);

const statusCfg: Record<ContractStatus, { pill: string; dot: string }> = {
  "نشط":         { pill: "bg-[#e8f5e9] text-[#2d7b33]",  dot: "bg-[#2d7b33]" },
  "مكتمل":       { pill: "bg-gray-100 text-gray-500",     dot: "bg-gray-400" },
  "قيد التفعيل": { pill: "bg-amber-50 text-amber-600",   dot: "bg-amber-500" },
};

const tabs = ["الكل", "النشطة", "المكتملة", "قيد التفعيل"] as const;
type Tab = typeof tabs[number];

// ─── Components ──────────────────────────────────────────────────
function KpiCard({ label, value, sub, green }: { label: string; value: string; sub?: string; green?: boolean }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-snug">{label}</p>
      <p className={`text-lg font-extrabold leading-none ${green ? "text-[#2d7b33]" : "text-[#1a1a1a]"}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("الكل");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = contracts.filter((c) => {
    if (activeTab === "الكل") return true;
    if (activeTab === "النشطة") return c.status === "نشط";
    if (activeTab === "المكتملة") return c.status === "مكتمل";
    if (activeTab === "قيد التفعيل") return c.status === "قيد التفعيل";
    return true;
  });

  return (
    <AppShell>
      <div className="min-h-screen bg-[#f5f5f5] pb-24 lg:pb-10 font-[family-name:var(--font-tajawal)]">

        {/* ── Header ── */}
        <div className="bg-white px-5 lg:px-8 pt-12 lg:pt-8 pb-5 border-b border-gray-100">
          <h1 className="text-xl font-extrabold text-[#1a1a1a]">عقودي</h1>
          <p className="text-xs text-gray-400 mt-0.5">لوحة متابعة الدخل والاستثمارات</p>
        </div>

        <div className="px-4 lg:px-8 pt-4 lg:pt-6 flex flex-col gap-5 max-w-5xl">

          {/* ══ 1. KPI Summary ════════════════════════════════════ */}
          {/* Mobile: big green card + 3-col grid */}
          <div className="flex flex-col gap-3">

            {/* Primary card */}
            <div className="relative bg-[#2d7b33] rounded-3xl p-5 overflow-hidden shadow-lg shadow-[#2d7b33]/20">
              <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full bg-white/[0.07]" />
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/[0.07]" />
              <div className="relative z-10">
                <p className="text-white/55 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">الدخل الشهري</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                    {summary.monthlyIncome.toLocaleString()}
                  </span>
                  <span className="text-white/55 text-base">ريال</span>
                </div>
                <div className="h-px bg-white/15 mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-wide mb-0.5">سنوياً</p>
                    <p className="text-white font-extrabold text-sm">{summary.yearlyIncome.toLocaleString()} ريال</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-wide mb-0.5">التوزيع القادم</p>
                    <p className="text-white font-extrabold text-sm">{summary.nextDistDate}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-wide mb-0.5">العقود النشطة</p>
                    <p className="text-white font-extrabold text-sm">{summary.activeContracts} عقود</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 KPI tiles */}
            <div className="grid grid-cols-3 gap-2.5">
              <KpiCard label="إجمالي المستثمر"  value={`${(summary.totalInvested/1000).toFixed(0)}K`}  sub="ريال" />
              <KpiCard label="قيمة المحفظة"    value={`${(summary.portfolioValue/1000).toFixed(1)}K`} sub="ريال" />
              <KpiCard label="متوسط العائد"     value={`${summary.avgReturn}%`} sub="سنوياً" green />
            </div>
          </div>

          {/* ══ 2. Income Chart ═══════════════════════════════════ */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-extrabold text-[#1a1a1a]">أداء الدخل الشهري</h3>
                <p className="text-xs text-gray-400 mt-0.5">آخر 12 شهر</p>
              </div>
              <span className="text-xs bg-[#e8f5e9] text-[#2d7b33] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                +137%
              </span>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-1.5 h-28 lg:h-36 mb-2">
              {chartValues.map((val, i) => {
                const isLast = i === chartValues.length - 1;
                const heightPct = (val / chartMax) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-lg transition-all ${isLast ? "bg-[#2d7b33]" : "bg-[#2d7b33]/20"}`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-gray-400" style={{ fontSize: "8px" }}>{chartMonths[i]}</span>
                  </div>
                );
              })}
            </div>

            {/* Y-axis labels */}
            <div className="flex justify-between text-[10px] text-gray-300 px-0.5 mt-1">
              <span>0</span>
              <span>{(chartMax / 2 / 1000).toFixed(1)}K</span>
              <span>{(chartMax / 1000).toFixed(1)}K</span>
            </div>
          </div>

          {/* ══ 3. Auto Buy Entry Card ════════════════════════════ */}
          <div className="relative bg-gradient-to-l from-[#1a1a2e] to-[#2d2d5a] rounded-2xl p-5 overflow-hidden">
            <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-extrabold text-sm">الشراء التلقائي</p>
                <p className="text-white/55 text-xs mt-0.5">استثمر تلقائياً لتحقيق دخلك المستهدف</p>
              </div>
              <Link
                href="/auto-buy"
                className="bg-white text-[#2d2d5a] text-xs font-extrabold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap flex-shrink-0"
              >
                إعداد ←
              </Link>
            </div>
          </div>

          {/* ══ 3b. Secondary Market Entry Card ═════════════════ */}
          <div className="relative bg-gradient-to-l from-[#7b4d00] to-[#c9a84c] rounded-2xl p-5 overflow-hidden">
            <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="17 1 21 5 17 9"/>
                  <path d="M3 11V9a4 4 0 014-4h14"/>
                  <polyline points="7 23 3 19 7 15"/>
                  <path d="M21 13v2a4 4 0 01-4 4H3"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-extrabold text-sm">السوق الثانوي</p>
                <p className="text-white/65 text-xs mt-0.5">بيع حصتك أو اشترِ حصصاً من مستثمرين آخرين</p>
              </div>
              <Link
                href="/secondary-market"
                className="bg-white text-[#7b4d00] text-xs font-extrabold px-4 py-2.5 rounded-xl hover:bg-amber-50 transition-colors whitespace-nowrap flex-shrink-0"
              >
                تصفح السوق ←
              </Link>
            </div>
          </div>

          {/* ══ 4. Contracts ══════════════════════════════════════ */}
          <div>
            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0
                    ${activeTab === tab ? "bg-[#2d7b33] text-white" : "bg-white text-gray-500 shadow-sm"}`}
                >
                  {tab}
                  {tab === "الكل" && (
                    <span className={`mr-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                      ${activeTab === tab ? "bg-white/25 text-white" : "bg-gray-100 text-gray-400"}`}>
                      {contracts.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Contracts list */}
            <div className="flex flex-col gap-3">
              {filtered.map((c) => {
                const s = statusCfg[c.status];
                const isOpen = expanded === c.id;

                return (
                  <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">

                    {/* Main row */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : c.id)}
                      className="w-full flex items-center gap-3 px-4 py-4 text-right"
                    >
                      {/* Property thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-extrabold text-[#1a1a1a] truncate">{c.title}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.pill}`}>
                            <span className={`w-1 h-1 rounded-full ${s.dot} ${c.status === "نشط" ? "animate-pulse" : ""}`} />
                            {c.status}
                          </span>
                          <span className="text-[10px] text-gray-400">{c.type}</span>
                        </div>
                      </div>

                      {/* Income */}
                      <div className="text-left flex-shrink-0">
                        {c.status === "نشط" ? (
                          <>
                            <p className="text-sm font-extrabold text-[#2d7b33]">{c.monthlyIncome.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400">ريال/شهر</p>
                          </>
                        ) : c.status === "قيد التفعيل" ? (
                          <>
                            <p className="text-xs font-bold text-amber-500">قريباً</p>
                            <p className="text-[10px] text-gray-400">{c.annualReturn}% عائد</p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-bold text-gray-400">مكتمل</p>
                            <p className="text-[10px] text-gray-400">{c.annualReturn}% عائد</p>
                          </>
                        )}
                      </div>

                      {/* Expand arrow */}
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"
                        className={`flex-shrink-0 transition-transform duration-200 mr-1 ${isOpen ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {/* Expanded details */}
                    {isOpen && (
                      <div className="border-t border-gray-50 px-4 py-4 bg-gray-50/50">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {[
                            { label: "المبلغ المستثمر",   value: `${c.invested.toLocaleString()} ريال` },
                            { label: "الدخل السنوي",      value: c.status === "نشط" ? `${c.yearlyIncome.toLocaleString()} ريال` : "—" },
                            { label: "العائد السنوي",     value: `${c.annualReturn}%`, green: true },
                            { label: "الحصة من العقار",   value: `${c.sharePercent}%` },
                            { label: "التوزيع القادم",    value: c.nextDist },
                            { label: "تاريخ البدء",       value: c.startDate },
                          ].map((row) => (
                            <div key={row.label} className="bg-white rounded-xl p-3">
                              <p className="text-[10px] text-gray-400 mb-0.5">{row.label}</p>
                              <p className={`text-sm font-extrabold ${(row as { green?: boolean }).green ? "text-[#2d7b33]" : "text-[#1a1a1a]"}`}>
                                {row.value}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/opportunities/${c.id}`}
                            className="flex items-center justify-center gap-2 w-full bg-[#2d7b33] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#1f5a24] transition-colors"
                          >
                            عرض تفاصيل العقد
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </Link>
                          {c.status === "نشط" && (
                            <Link
                              href={`/secondary-market/list?contract=${c.id}`}
                              className="flex items-center justify-center gap-2 w-full border-2 border-[#c9a84c] text-[#7b4d00] text-sm font-bold py-2.5 rounded-xl hover:bg-amber-50 transition-colors"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="17 1 21 5 17 9"/>
                                <path d="M3 11V9a4 4 0 014-4h14"/>
                                <polyline points="7 23 3 19 7 15"/>
                                <path d="M21 13v2a4 4 0 01-4 4H3"/>
                              </svg>
                              عرض حصتي في السوق الثانوي
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-3xl mb-3">📋</p>
                  <p className="text-sm">لا توجد عقود في هذا التصنيف</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
