"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";

// ─── Contract lookup (mirrors portfolio data) ─────────────────────
const contractsMap: Record<string, {
  title: string; type: string; image: string;
  invested: number; sharePercent: number; annualReturn: number; monthlyIncome: number;
}> = {
  "1": {
    title: "برج العليا التجاري", type: "مكاتب تجارية",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=60&fit=crop",
    invested: 25000, sharePercent: 1.8, annualReturn: 12, monthlyIncome: 1360,
  },
  "3": {
    title: "فيلا بريميوم", type: "سكني",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=60&fit=crop",
    invested: 75000, sharePercent: 3.0, annualReturn: 9, monthlyIncome: 563,
  },
  "5": {
    title: "مول التجمع", type: "تجزئة تجارية",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&q=60&fit=crop",
    invested: 50000, sharePercent: 1.0, annualReturn: 11, monthlyIncome: 927,
  },
};

// ─── Inner form — reads searchParams ─────────────────────────────
function ListForm() {
  const router   = useRouter();
  const params   = useSearchParams();
  const cid      = params.get("contract") ?? "1";
  const contract = contractsMap[cid] ?? contractsMap["1"];

  const [askingPrice, setAskingPrice] = useState(contract.invested);
  const [note,        setNote]        = useState("");
  const [agreed,      setAgreed]      = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  const premium    = ((askingPrice - contract.invested) / contract.invested) * 100;
  const isDiscount = premium < 0;

  function handleSubmit() {
    if (!agreed) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-6 font-[family-name:var(--font-tajawal)]">
        <div className="w-20 h-20 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d7b33" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="text-xl font-extrabold text-[#1a1a1a] mb-2">تم إدراج حصتك!</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          حصتك في {contract.title} مُدرجة الآن في السوق الثانوي بسعر {askingPrice.toLocaleString()} ريال.
          سيتم إشعارك فور اهتمام مشترٍ.
        </p>
        <button
          onClick={() => router.push("/secondary-market")}
          className="w-full max-w-sm bg-[#2d7b33] text-white font-extrabold py-4 rounded-2xl text-sm hover:bg-[#1f5a24] transition-colors mb-3"
        >
          تصفح السوق الثانوي
        </button>
        <button
          onClick={() => router.push("/portfolio")}
          className="w-full max-w-sm bg-white text-gray-500 font-bold py-3.5 rounded-2xl text-sm hover:bg-gray-50 transition-colors"
        >
          العودة لعقودي
        </button>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[#f5f5f5] pb-24 lg:pb-10 font-[family-name:var(--font-tajawal)]">

        {/* ── Header ── */}
        <div className="bg-white px-5 lg:px-8 pt-12 lg:pt-8 pb-5 border-b border-gray-100 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5">
              <path d="M15 18l6-6-6-6" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#1a1a1a]">إدراج للبيع</h1>
            <p className="text-xs text-gray-400 mt-0.5">عرض حصتك في السوق الثانوي</p>
          </div>
        </div>

        <div className="px-4 lg:px-8 pt-4 flex flex-col gap-4 max-w-lg">

          {/* ── Contract summary card ── */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-3.5 items-center">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={contract.image} alt={contract.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-[#1a1a1a] truncate">{contract.title}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{contract.type} · حصة {contract.sharePercent}%</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs font-extrabold text-[#2d7b33]">{contract.annualReturn}% سنوياً</span>
                <span className="text-xs text-gray-400">{contract.monthlyIncome.toLocaleString()} ريال/شهر</span>
              </div>
            </div>
          </div>

          {/* ── Asking price ── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-[#1a1a1a]">سعر الطلب</h3>
              <p className="text-xs text-gray-400 mt-0.5">سعر الشراء الأصلي: {contract.invested.toLocaleString()} ريال</p>
            </div>

            {/* Price input */}
            <div className="relative">
              <input
                type="number"
                value={askingPrice}
                onChange={(e) => setAskingPrice(Number(e.target.value))}
                className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#c9a84c] rounded-xl px-4 py-3.5 text-lg font-extrabold text-[#1a1a1a] focus:outline-none transition-colors"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">ريال</span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={Math.round(contract.invested * 0.7)}
              max={Math.round(contract.invested * 1.3)}
              step={500}
              value={askingPrice}
              onChange={(e) => setAskingPrice(Number(e.target.value))}
              className="w-full accent-[#c9a84c]"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>−30% ({Math.round(contract.invested * 0.7).toLocaleString()})</span>
              <span>القيمة الأصلية</span>
              <span>+30% ({Math.round(contract.invested * 1.3).toLocaleString()})</span>
            </div>

            {/* Premium/discount indicator */}
            <div className={`flex items-center justify-between rounded-xl px-4 py-3
              ${isDiscount ? "bg-[#e8f5e9]" : "bg-amber-50"}`}>
              <p className="text-xs font-semibold text-gray-600">
                {isDiscount ? "تبيع بخصم" : "تبيع بعلاوة"}
              </p>
              <p className={`text-sm font-extrabold ${isDiscount ? "text-[#2d7b33]" : "text-amber-600"}`}>
                {isDiscount ? "−" : "+"}{Math.abs(premium).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* ── Note to buyer ── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-extrabold text-[#1a1a1a]">ملاحظة للمشتري <span className="text-gray-400 font-medium">(اختياري)</span></h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="اكتب سبب البيع أو أي معلومة مفيدة للمشتري..."
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>

          {/* ── T&C ── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1a1a1a] mb-3">كيف يعمل الإدراج؟</h3>
            <div className="flex flex-col gap-2 mb-4">
              {[
                "سيتم عرض حصتك لجميع المستثمرين في السوق الثانوي",
                "عند الموافقة على البيع، تُحوَّل الحصة فوراً للمشتري",
                "تُحتسب رسوم منصة نافع 1% من قيمة الصفقة",
                "يحق لك سحب الإدراج في أي وقت قبل اكتمال الصفقة",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#e8f5e9] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[9px] font-extrabold text-[#2d7b33]">{i + 1}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-[#2d7b33] w-4 h-4 flex-shrink-0"
              />
              <p className="text-xs text-gray-500 leading-relaxed">
                أوافق على شروط وأحكام السوق الثانوي لمنصة نافع وأؤكد صحة معلومات الإدراج
              </p>
            </label>
          </div>

          {/* ── CTA ── */}
          <div className="flex flex-col gap-2.5 pb-4">
            <button
              onClick={handleSubmit}
              disabled={!agreed}
              className={`w-full py-4 rounded-2xl text-sm font-extrabold transition-all
                ${agreed
                  ? "bg-[#c9a84c] text-white hover:bg-[#b8953f] active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              إدراج حصتي في السوق
            </button>
            <button
              onClick={() => router.back()}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-gray-500 bg-white hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>

        </div>
      </div>
    </AppShell>
  );
}

// ─── Page wrapper — Suspense required for useSearchParams ─────────
export default function ListPage() {
  return (
    <Suspense>
      <ListForm />
    </Suspense>
  );
}
