"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";

// ─── Data ────────────────────────────────────────────────────────
type Listing = {
  id: string;
  contractId: string;
  title: string;
  type: string;
  image: string;
  sharePercent: number;
  originalValue: number;
  askingPrice: number;
  annualReturn: number;
  monthlyIncome: number;
  daysListed: number;
  seller: string;
  myListing?: boolean;
};

const listings: Listing[] = [
  {
    id: "l1",
    contractId: "1",
    title: "برج العليا التجاري",
    type: "مكاتب تجارية",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=60&fit=crop",
    sharePercent: 1.2,
    originalValue: 18000,
    askingPrice: 19800,
    annualReturn: 12,
    monthlyIncome: 912,
    daysListed: 5,
    seller: "م.ع",
  },
  {
    id: "l2",
    contractId: "5",
    title: "مول التجمع",
    type: "تجزئة تجارية",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&q=60&fit=crop",
    sharePercent: 0.5,
    originalValue: 25000,
    askingPrice: 25000,
    annualReturn: 11,
    monthlyIncome: 463,
    daysListed: 12,
    seller: "ف.م",
  },
  {
    id: "l3",
    contractId: "3",
    title: "فيلا بريميوم",
    type: "سكني",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=60&fit=crop",
    sharePercent: 2.0,
    originalValue: 50000,
    askingPrice: 48500,
    annualReturn: 9,
    monthlyIncome: 750,
    daysListed: 3,
    seller: "خ.ب",
  },
  {
    id: "l4",
    contractId: "1",
    title: "برج العليا التجاري",
    type: "مكاتب تجارية",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=60&fit=crop",
    sharePercent: 0.8,
    originalValue: 12000,
    askingPrice: 12600,
    annualReturn: 12,
    monthlyIncome: 608,
    daysListed: 18,
    seller: "ن.س",
    myListing: true,
  },
];

// My listed contracts (pulled from user's own contracts)
const myListings = listings.filter((l) => l.myListing);
const marketListings = listings.filter((l) => !l.myListing);

const PROPERTY_TYPES = ["الكل", "مكاتب تجارية", "تجزئة تجارية", "سكني", "مستودعات"];
const SORT_OPTIONS = [
  { value: "newest",   label: "الأحدث" },
  { value: "yield",    label: "أعلى عائد" },
  { value: "discount", label: "أفضل سعر" },
];

// ─── Listing Card ─────────────────────────────────────────────────
function ListingCard({ l, own = false }: { l: Listing; own?: boolean }) {
  const premium = ((l.askingPrice - l.originalValue) / l.originalValue) * 100;
  const isDiscount = premium < 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="flex gap-3.5 p-4">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l.image} alt={l.title} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-[#1a1a1a] truncate leading-snug">{l.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{l.type} · حصة {l.sharePercent}%</p>
            </div>
            {/* Premium/discount badge */}
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0
              ${isDiscount ? "bg-[#e8f5e9] text-[#2d7b33]" : "bg-amber-50 text-amber-600"}`}>
              {isDiscount ? `خصم ${Math.abs(premium).toFixed(1)}%` : `علاوة ${premium.toFixed(1)}%`}
            </span>
          </div>

          {/* Metrics row */}
          <div className="flex items-center gap-3 mt-2.5">
            <div>
              <p className="text-xs font-extrabold text-[#1a1a1a]">{l.askingPrice.toLocaleString()}</p>
              <p className="text-[9px] text-gray-400">سعر الطلب</p>
            </div>
            <div className="w-px h-6 bg-gray-100" />
            <div>
              <p className="text-xs font-extrabold text-[#2d7b33]">{l.annualReturn}%</p>
              <p className="text-[9px] text-gray-400">عائد سنوي</p>
            </div>
            <div className="w-px h-6 bg-gray-100" />
            <div>
              <p className="text-xs font-extrabold text-[#1a1a1a]">{l.monthlyIncome.toLocaleString()}</p>
              <p className="text-[9px] text-gray-400">ريال/شهر</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-50 px-4 py-3 flex items-center justify-between">
        <p className="text-[10px] text-gray-400">
          {own ? "مُدرج منذ" : `بائع: ${l.seller} ·`}
          {" "}{l.daysListed} {l.daysListed === 1 ? "يوم" : "أيام"}
        </p>
        {own ? (
          <button className="text-xs font-bold text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            إلغاء الإدراج
          </button>
        ) : (
          <Link
            href={`/secondary-market/${l.id}`}
            className="bg-[#2d7b33] text-white text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-[#1f5a24] transition-colors"
          >
            شراء الحصة
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────
export default function SecondaryMarketPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState("الكل");
  const [sort,       setSort]       = useState("newest");
  const [search,     setSearch]     = useState("");

  const filtered = marketListings
    .filter((l) => {
      const matchType = typeFilter === "الكل" || l.type === typeFilter;
      const matchQ    = l.title.includes(search) || l.type.includes(search);
      return matchType && matchQ;
    })
    .sort((a, b) => {
      if (sort === "yield")    return b.annualReturn - a.annualReturn;
      if (sort === "discount") return ((a.askingPrice - a.originalValue) / a.originalValue) - ((b.askingPrice - b.originalValue) / b.originalValue);
      return a.daysListed - b.daysListed; // newest = fewer days listed
    });

  return (
    <AppShell>
      <div className="min-h-screen bg-[#f5f5f5] pb-24 lg:pb-10 font-[family-name:var(--font-tajawal)]">

        {/* ── Header ── */}
        <div className="bg-white px-5 lg:px-8 pt-12 lg:pt-8 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5">
                <path d="M15 18l6-6-6-6" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-[#1a1a1a]">السوق الثانوي</h1>
              <p className="text-xs text-gray-400 mt-0.5">تداول حصص العقارات مع مستثمرين آخرين</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex gap-4 pb-1">
            {[
              { label: "حصص متاحة", value: marketListings.length },
              { label: "عقارات مدرجة", value: new Set(marketListings.map((l) => l.contractId)).size },
              { label: "صفقات هذا الشهر", value: 14 },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <p className="text-base font-extrabold text-[#1a1a1a]">{s.value}</p>
                <p className="text-[10px] text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 lg:px-8 pt-4 flex flex-col gap-4 max-w-2xl">

          {/* ── Search ── */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن عقار..."
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 pr-11 text-sm shadow-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
            <svg className="absolute top-3.5 right-4" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>

          {/* ── Filters row ── */}
          <div className="flex items-center gap-2">
            <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide">
              {PROPERTY_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0
                    ${typeFilter === t ? "bg-[#c9a84c] text-white" : "bg-white text-gray-500 shadow-sm"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl text-xs font-semibold px-3 py-2 flex-shrink-0 focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* ══ My listings ═══════════════════════════════════════ */}
          {myListings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 px-1">حصصي المعروضة ({myListings.length})</p>
                <Link href="/portfolio" className="text-xs text-[#2d7b33] font-semibold">إدارة العقود</Link>
              </div>
              <div className="flex flex-col gap-3">
                {myListings.map((l) => <ListingCard key={l.id} l={l} own />)}
              </div>
            </div>
          )}

          {/* ══ Market listings ═══════════════════════════════════ */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-3 px-1">
              {filtered.length > 0
                ? `الحصص المتاحة للشراء (${filtered.length})`
                : "لا توجد نتائج"}
            </p>
            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
              {filtered.map((l) => <ListingCard key={l.id} l={l} />)}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-sm">لا توجد حصص بهذا التصنيف</p>
              </div>
            )}
          </div>

          {/* ══ CTA for own listing ═══════════════════════════════ */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 014-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 01-4 4H3"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-[#1a1a1a]">تريد بيع حصتك؟</p>
              <p className="text-xs text-gray-400 mt-0.5">ادرج حصتك من صفحة عقودي</p>
            </div>
            <Link
              href="/portfolio"
              className="bg-[#c9a84c] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl hover:bg-[#b8953f] transition-colors whitespace-nowrap flex-shrink-0"
            >
              عقودي ←
            </Link>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
