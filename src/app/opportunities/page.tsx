"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";

const allOpps = [
  { id: "1", title: "برج العليا التجاري",   location: "الرياض، حي العليا",          type: "مكاتب تجارية", return: 12, duration: "10 سنوات", monthly: 5458,  share: 25000, funded: 68,  investors: 142, status: "جاري التمويل", featured: true,  image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=75&fit=crop" },
  { id: "2", title: "مجمع الواحة التجاري",  location: "جدة، حي الزهراء",           type: "تجزئة تجارية", return: 10, duration: "7 سنوات",  monthly: 2500,  share: 30000, funded: 45,  investors: 87,  status: "جاري التمويل", featured: false, image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=75&fit=crop" },
  { id: "3", title: "فيلا بريميوم",          location: "الدمام، حي الشاطئ",         type: "سكني",         return: 9,  duration: "5 سنوات",  monthly: 1875,  share: 25000, funded: 100, investors: 64,  status: "مكتمل",         featured: false, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=75&fit=crop" },
  { id: "4", title: "مركز لوجستي الشمال",   location: "الرياض، المنطقة الصناعية",  type: "مستودعات",     return: 14, duration: "8 سنوات",  monthly: 9333,  share: 80000, funded: 22,  investors: 38,  status: "جاري التمويل", featured: false, image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=75&fit=crop" },
  { id: "5", title: "مول التجمع",            location: "المدينة المنورة",           type: "تجزئة تجارية", return: 11, duration: "6 سنوات",  monthly: 4583,  share: 50000, funded: 80,  investors: 201, status: "جاري التمويل", featured: false, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=75&fit=crop" },
];

const categories = ["الكل", "مكاتب تجارية", "تجزئة تجارية", "سكني", "مستودعات"];

// ─── Status config ───────────────────────────────────────────────
const statusCfg: Record<string, { pill: string; dot: string; bar: string }> = {
  "جاري التمويل": { pill: "bg-blue-50 text-blue-600",      dot: "bg-blue-500",   bar: "from-blue-400 to-blue-600" },
  "نشط":          { pill: "bg-[#e8f5e9] text-[#2d7b33]",  dot: "bg-[#2d7b33]",  bar: "from-[#4aab52] to-[#2d7b33]" },
  "مكتمل":        { pill: "bg-gray-100 text-gray-400",     dot: "bg-gray-400",   bar: "from-gray-300 to-gray-400" },
};

// ─── OppCard ─────────────────────────────────────────────────────
function OppCard({ opp, featured = false }: { opp: typeof allOpps[0]; featured?: boolean }) {
  const s = statusCfg[opp.status] ?? statusCfg["نشط"];

  return (
    <Link href={`/opportunities/${opp.id}`}>
      <div className={`bg-white rounded-3xl overflow-hidden transition-all active:scale-[0.98]
        ${featured ? "shadow-md ring-2 ring-[#2d7b33]/15" : "shadow-sm hover:shadow-md"}`}>

        {/* ── Image ── */}
        <div className={`relative overflow-hidden ${featured ? "h-52" : "h-44"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={opp.image} alt={opp.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />

          {/* Featured badge */}
          {featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#c9a84c] text-white text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                ⭐ مميزة
              </span>
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-black/35 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
              {opp.type}
            </span>
          </div>

          {/* Title + location over image */}
          <div className="absolute bottom-0 inset-x-0 px-4 pb-4">
            <h3 className="text-white font-extrabold text-base leading-snug">{opp.title}</h3>
            <p className="text-white/65 text-xs mt-1 flex items-center gap-1">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {opp.location}
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-4 pt-4 pb-4 flex flex-col gap-3.5">

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-1.5">
            {/* Return */}
            <div className="bg-[#e8f5e9] rounded-2xl py-2.5 text-center">
              <p className="text-[#2d7b33] font-extrabold text-base leading-none">{opp.return}%</p>
              <p className="text-[10px] text-gray-500 mt-1">عائد سنوي</p>
            </div>
            {/* Duration */}
            <div className="bg-gray-50 rounded-2xl py-2.5 text-center">
              <p className="text-[#1a1a1a] font-extrabold text-xs leading-none">{opp.duration}</p>
              <p className="text-[10px] text-gray-400 mt-1">المدة</p>
            </div>
            {/* Monthly income */}
            <div className="bg-gray-50 rounded-2xl py-2.5 text-center">
              <p className="text-[#1a1a1a] font-extrabold text-xs leading-none">
                {opp.monthly >= 1000 ? `${(opp.monthly / 1000).toFixed(1)}K` : opp.monthly}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">دخل/شهر</p>
            </div>
          </div>

          {/* Funding status */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              {/* Status pill with live dot */}
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${s.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${opp.status === "جاري التمويل" ? "animate-pulse" : ""}`} />
                {opp.status}
              </span>
              <span className="text-xs font-extrabold text-[#1a1a1a]">{opp.funded}%</span>
            </div>
            {/* Progress bar */}
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full bg-gradient-to-l ${s.bar} transition-all`}
                style={{ width: `${opp.funded}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">{opp.investors} مستثمر شارك</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Share + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">متوسط الحصة</p>
              <p className="text-sm font-extrabold text-[#1a1a1a]">
                {opp.share.toLocaleString()} <span className="text-xs font-medium text-gray-400">ريال</span>
              </p>
            </div>
            <span className="bg-[#2d7b33] text-white text-xs font-bold px-5 py-2.5 rounded-2xl flex items-center gap-1.5">
              عرض التفاصيل
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
}

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");

  const filtered = allOpps.filter((o) => {
    const matchCat = category === "الكل" || o.type === category;
    const matchQ   = o.title.includes(search) || o.location.includes(search) || o.type.includes(search);
    return matchCat && matchQ;
  });

  const featured  = filtered.filter((o) => o.featured);
  const rest      = filtered.filter((o) => !o.featured);

  return (
    <AppShell>
      <div className="min-h-screen bg-[#f5f5f5] pb-24 lg:pb-8 font-[family-name:var(--font-tajawal)]">

        {/* Header */}
        <div className="bg-white px-5 lg:px-8 pt-12 lg:pt-8 pb-4 border-b border-gray-100">
          <h1 className="text-xl font-extrabold text-[#1a1a1a] mb-4">الفرص العقارية</h1>

          {/* Search */}
          <div className="relative mb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن فرصة..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#2d7b33] transition-colors"
            />
            <svg className="absolute top-3.5 right-4" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0
                  ${category === c ? "bg-[#2d7b33] text-white" : "bg-gray-100 text-gray-500"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 lg:px-8 pt-4 flex flex-col gap-5 max-w-5xl">

          {/* Featured */}
          {featured.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 mb-3 px-1">مميزة</p>
              <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
                {featured.map((o) => <OppCard key={o.id} opp={o} featured />)}
              </div>
            </div>
          )}

          {/* All */}
          {rest.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 mb-3 px-1">جميع الفرص ({rest.length})</p>
              <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 xl:grid-cols-3">
                {rest.map((o) => <OppCard key={o.id} opp={o} />)}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm">لا توجد نتائج</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
