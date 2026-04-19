"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";

// ─── Types ───────────────────────────────────────────────────────
type RiskLevel = "منخفض" | "متوسط" | "مرتفع";
type Frequency  = "شهري" | "ربع سنوي" | "نصف سنوي";

const PROPERTY_TYPES = ["مكاتب تجارية", "تجزئة تجارية", "سكني", "مستودعات"] as const;

// ─── Helpers ─────────────────────────────────────────────────────
const riskCfg: Record<RiskLevel, { bg: string; text: string; border: string; desc: string; range: string }> = {
  "منخفض": {
    bg: "bg-[#e8f5e9]", text: "text-[#2d7b33]", border: "border-[#2d7b33]",
    desc: "فرص سكنية ومكاتب مستقرة بعائد 8–10%",
    range: "8 – 10%",
  },
  "متوسط": {
    bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-500",
    desc: "تجزئة تجارية ومراكز لوجستية بعائد 10–13%",
    range: "10 – 13%",
  },
  "مرتفع": {
    bg: "bg-red-50", text: "text-red-500", border: "border-red-400",
    desc: "مشاريع تطوير وقيمة مضافة بعائد 13–18%",
    range: "13 – 18%",
  },
};

const freqCfg: Record<Frequency, { label: string; icon: string }> = {
  "شهري":        { label: "كل شهر",       icon: "📅" },
  "ربع سنوي":   { label: "كل 3 أشهر",    icon: "🗓️" },
  "نصف سنوي":   { label: "كل 6 أشهر",    icon: "📆" },
};

// ─── Section wrapper ─────────────────────────────────────────────
function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-extrabold text-[#1a1a1a]">{title}</h3>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────
export default function AutoBuyPage() {
  const router = useRouter();

  const [enabled,     setEnabled]     = useState(false);
  const [target,      setTarget]      = useState(5000);
  const [perOpp,      setPerOpp]      = useState(25000);
  const [risk,        setRisk]        = useState<RiskLevel>("متوسط");
  const [frequency,   setFrequency]   = useState<Frequency>("شهري");
  const [types,       setTypes]       = useState<Set<string>>(new Set(["مكاتب تجارية", "تجزئة تجارية"]));
  const [maxOpp,      setMaxOpp]      = useState(3);
  const [saved,       setSaved]       = useState(false);

  function toggleType(t: string) {
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) { if (next.size > 1) next.delete(t); }
      else next.add(t);
      return next;
    });
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const rc = riskCfg[risk];

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
            <h1 className="text-xl font-extrabold text-[#1a1a1a]">الشراء التلقائي</h1>
            <p className="text-xs text-gray-400 mt-0.5">استثمر بذكاء دون جهد يدوي</p>
          </div>
        </div>

        <div className="px-4 lg:px-8 pt-4 lg:pt-6 flex flex-col gap-4 max-w-2xl">

          {/* ══ 0. Hero Explainer Card ════════════════════════════ */}
          <div className="relative bg-gradient-to-l from-[#1a1a2e] to-[#2d2d5a] rounded-2xl p-5 overflow-hidden">
            <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-extrabold text-base">كيف يعمل؟</p>
                {/* Toggle */}
                <button
                  onClick={() => setEnabled(!enabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0
                    ${enabled ? "bg-[#2d7b33]" : "bg-white/25"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300
                      ${enabled ? "right-0.5" : "left-0.5"}`}
                  />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { step: "١", icon: "🎯", text: "تحدد هدفك الشهري" },
                  { step: "٢", icon: "🔍", text: "نختار الفرص المناسبة" },
                  { step: "٣", icon: "💰", text: "يضاف الدخل تلقائياً" },
                ].map((s) => (
                  <div key={s.step} className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg">{s.icon}</div>
                    <p className="text-white/70 text-[10px] leading-snug">{s.text}</p>
                  </div>
                ))}
              </div>
              <p className={`mt-3 text-center text-xs font-bold px-3 py-1.5 rounded-full transition-colors
                ${enabled ? "bg-[#2d7b33] text-white" : "bg-white/10 text-white/50"}`}>
                {enabled ? "✓ الشراء التلقائي مُفعّل" : "غير مُفعّل — فعّله من الزر أعلاه"}
              </p>
            </div>
          </div>

          {/* ══ 1. Target monthly income ══════════════════════════ */}
          <Section title="الدخل الشهري المستهدف" sub="سنقوم بالاستثمار حتى تصل لهذا الرقم">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-4xl font-extrabold text-[#2d7b33]">{target.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">ريال / شهر</span>
              </div>
              <input
                type="range"
                min={1000} max={50000} step={500}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full accent-[#2d7b33]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1,000</span>
                <span>25,000</span>
                <span>50,000</span>
              </div>
            </div>

            {/* Progress toward goal */}
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-500 font-semibold">تحقق الهدف</span>
                <span className="font-extrabold text-[#2d7b33]">
                  {Math.min(100, Math.round((2850 / target) * 100))}%
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-l from-[#4aab52] to-[#2d7b33] transition-all duration-500"
                  style={{ width: `${Math.min(100, (2850 / target) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                <span>الحالي: 2,850 ريال</span>
                <span>المستهدف: {target.toLocaleString()} ريال</span>
              </div>
            </div>
          </Section>

          {/* ══ 2. Investment per opportunity ═════════════════════ */}
          <Section title="مبلغ الاستثمار لكل فرصة" sub="الحد الأدنى 25,000 ريال — الحد الأقصى 200,000 ريال">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-4xl font-extrabold text-[#1a1a1a]">{perOpp.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">ريال</span>
              </div>
              <input
                type="range"
                min={25000} max={200000} step={5000}
                value={perOpp}
                onChange={(e) => setPerOpp(Number(e.target.value))}
                className="w-full accent-[#2d7b33]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>25K</span>
                <span>100K</span>
                <span>200K</span>
              </div>
            </div>
          </Section>

          {/* ══ 3. Risk level ═════════════════════════════════════ */}
          <Section title="مستوى المخاطرة" sub="اختر توجهك الاستثماري">
            <div className="flex flex-col gap-2.5">
              {(["منخفض", "متوسط", "مرتفع"] as RiskLevel[]).map((level) => {
                const c = riskCfg[level];
                const active = risk === level;
                return (
                  <button
                    key={level}
                    onClick={() => setRisk(level)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-right
                      ${active ? `${c.bg} ${c.border}` : "bg-gray-50 border-transparent"}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? c.bg : "bg-white"}`}>
                      <span className="text-base">
                        {level === "منخفض" ? "🌿" : level === "متوسط" ? "⚖️" : "🚀"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-extrabold ${active ? c.text : "text-[#1a1a1a]"}`}>{level}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{c.desc}</p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className={`text-xs font-extrabold ${active ? c.text : "text-gray-400"}`}>{c.range}</p>
                      <p className="text-[10px] text-gray-400">عائد متوقع</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* ══ 4. Property types ═════════════════════════════════ */}
          <Section title="أنواع العقارات المفضلة" sub="اختر واحداً أو أكثر">
            <div className="grid grid-cols-2 gap-2">
              {PROPERTY_TYPES.map((t) => {
                const active = types.has(t);
                const icon = t === "مكاتب تجارية" ? "🏢"
                           : t === "تجزئة تجارية" ? "🛍️"
                           : t === "سكني"          ? "🏡"
                                                   : "🏭";
                return (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-right
                      ${active ? "bg-[#e8f5e9] border-[#2d7b33]" : "bg-gray-50 border-transparent"}`}
                  >
                    <span className="text-xl">{icon}</span>
                    <div className="flex-1">
                      <p className={`text-xs font-extrabold ${active ? "text-[#2d7b33]" : "text-[#1a1a1a]"}`}>{t}</p>
                    </div>
                    {active && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d7b33" strokeWidth="2.5" className="flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* ══ 5. Frequency ══════════════════════════════════════ */}
          <Section title="تكرار الاستثمار" sub="كم مرة تريد الاستثمار تلقائياً؟">
            <div className="grid grid-cols-3 gap-2">
              {(["شهري", "ربع سنوي", "نصف سنوي"] as Frequency[]).map((f) => {
                const active = frequency === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all
                      ${active ? "bg-[#e8f5e9] border-[#2d7b33]" : "bg-gray-50 border-transparent"}`}
                  >
                    <span className="text-xl">{freqCfg[f].icon}</span>
                    <p className={`text-xs font-extrabold ${active ? "text-[#2d7b33]" : "text-[#1a1a1a]"}`}>{f}</p>
                    <p className="text-[10px] text-gray-400">{freqCfg[f].label}</p>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* ══ 6. Max concurrent opportunities ══════════════════ */}
          <Section title="الحد الأقصى للفرص المتزامنة" sub="كم فرصة استثمارية في نفس الوقت؟">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setMaxOpp(Math.max(1, maxOpp - 1))}
                className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-[#1a1a1a] flex-shrink-0"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <p className="text-4xl font-extrabold text-[#1a1a1a]">{maxOpp}</p>
                <p className="text-xs text-gray-400 mt-1">فرصة في نفس الوقت</p>
              </div>
              <button
                onClick={() => setMaxOpp(Math.min(10, maxOpp + 1))}
                className="w-11 h-11 rounded-full bg-[#e8f5e9] flex items-center justify-center text-xl font-bold text-[#2d7b33] flex-shrink-0"
              >
                +
              </button>
            </div>
          </Section>

          {/* ══ 7. Summary box ════════════════════════════════════ */}
          <div className="bg-[#e8f5e9] rounded-2xl p-4 border border-[#2d7b33]/15">
            <p className="text-sm font-extrabold text-[#2d7b33] mb-3">ملخص إعدادك</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "الهدف الشهري",        value: `${target.toLocaleString()} ريال` },
                { label: "مبلغ كل استثمار",      value: `${perOpp.toLocaleString()} ريال` },
                { label: "مستوى المخاطرة",       value: risk },
                { label: "أنواع العقارات",        value: Array.from(types).join(" · ") },
                { label: "التكرار",               value: frequency },
                { label: "حد الفرص المتزامنة",   value: `${maxOpp} فرص` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-start gap-4">
                  <span className="text-xs text-gray-500">{row.label}</span>
                  <span className="text-xs font-extrabold text-[#1a1a1a] text-left">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══ CTA ══════════════════════════════════════════════ */}
          <div className="flex flex-col gap-2.5 pb-4">
            <button
              onClick={handleSave}
              className={`w-full py-4 rounded-2xl text-sm font-extrabold transition-all
                ${saved
                  ? "bg-[#e8f5e9] text-[#2d7b33]"
                  : "bg-[#2d7b33] text-white hover:bg-[#1f5a24] active:scale-[0.98]"
                }`}
            >
              {saved ? "✓ تم الحفظ" : (enabled ? "حفظ وتفعيل الشراء التلقائي" : "حفظ الإعدادات")}
            </button>
            <button
              onClick={() => router.back()}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-gray-500 bg-white hover:bg-gray-50 transition-colors"
            >
              رجوع
            </button>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
