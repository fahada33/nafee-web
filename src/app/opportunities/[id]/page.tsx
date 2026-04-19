"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";

// ─── Data ───────────────────────────────────────────────────────
const opp = {
  // ── Identity
  title: "برج العليا التجاري",
  location: "الرياض، حي العليا",
  status: "جاري التمويل" as "جاري التمويل" | "نشط" | "مكتمل",
  type: "مكاتب تجارية",
  description: "برج أعمال متكامل في قلب حي العليا بالرياض، يضم مكاتب تجارية بعقود إيجار طويلة الأجل مع شركات مرموقة.",

  // ── Key indicators
  annualReturn: 12,
  duration: "10 سنوات",
  totalValue: 5_000_000,

  // ── Investment summary
  monthlyIncome: 5458,
  shareAmount: 25_000,
  minInvestment: 25_000,
  capitalRecovery: 54,
  distributionCount: 120,

  // ── Funding progress
  funded: 68,
  totalInvestors: 142,
  fundingDeadline: "30 يونيو 2025",

  // ── Property details (section 8)
  propertyDetails: {
    area: "4,200 م²",
    floors: "18 طابقاً",
    occupancy: "94%",
    developer: "مجموعة الراجحي للتطوير",
    usage: "تجاري — مكاتب مؤجرة",
    age: "تحت الإنشاء (2024)",
    city: "الرياض",
    district: "حي العليا",
  },

  // ── Returns mechanism (section 9)
  returns: {
    how: "تُحقق العوائد من إيرادات الإيجار الشهري المحصّلة من المستأجرين بموجب عقود ثابتة متعددة السنوات.",
    schedule: "شهري",
    firstPayout: "بعد 30 يوماً من اكتمال التمويل",
    type: "مستهدف (غير مضمون)",
    note: "يُحسب العائد المعروض على أساس سنوي ويُوزَّع شهرياً على حصص المستثمرين.",
  },

  // ── Risks (section 10)
  risks: [
    "العائد المعروض مستهدف وليس مضموناً قانونياً",
    "قد تتأثر التوزيعات بأداء العقار أو شغور الوحدات",
    "الاستثمار مرتبط بشروط عقد الإيجار وآليات إدارة الأصل",
    "المخاطر التشغيلية والسوقية قائمة كما في أي استثمار عقاري",
    "لا يوجد سوق ثانوي لإعادة البيع في الوقت الحالي",
  ],

  // ── Documents (section 11)
  documents: [
    { name: "ملخص الفرصة الاستثمارية",  type: "PDF", size: "1.2 MB" },
    { name: "نشرة الإصدار الكاملة",       type: "PDF", size: "3.8 MB" },
    { name: "تقرير التقييم العقاري",       type: "PDF", size: "2.1 MB" },
    { name: "نموذج العقد الاستثماري",     type: "PDF", size: "0.9 MB" },
    { name: "الشروط والأحكام",             type: "PDF", size: "0.5 MB" },
  ],

  // ── FAQ (section 12)
  faqs: [
    { q: "متى أستلم العوائد؟",            a: "تُصرف العوائد شهرياً في اليوم 15 من كل شهر، بعد مرور 30 يوماً على اكتمال التمويل." },
    { q: "هل أستطيع الخروج مبكراً؟",     a: "حالياً لا يتوفر سوق ثانوي. يُمكن الخروج عند انتهاء مدة العقد أو في حالات استثنائية وفق الشروط." },
    { q: "هل أحتاج إلى محفظة؟",          a: "نعم، يجب شحن محفظتك في نافع قبل الاستثمار. عملية الشراء تتم من الرصيد المتاح." },
    { q: "ما الحد الأدنى للاستثمار؟",     a: "الحد الأدنى هو 25,000 ريال لشراء حصة واحدة كاملة في هذه الفرصة." },
    { q: "ماذا يحدث عند اكتمال التمويل؟", a: "يُغلق باب الاستثمار، تُوقَّع العقود، ويبدأ العداد نحو أول توزيع بعد 30 يوماً." },
  ],

  // ── Images
  images: [
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=860&q=80&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=860&q=80&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200968a677a?w=860&q=80&fit=crop",
    "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=860&q=80&fit=crop",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=860&q=80&fit=crop",
  ],
};

const WALLET_BALANCE = 42500;

type Step = "detail" | "contract" | "confirm" | "success";

// ─── Section Title ──────────────────────────────────────────────
function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{icon}</span>
      <h2 className="text-sm font-extrabold text-[#1a1a1a]">{title}</h2>
    </div>
  );
}

// ─── FAQ List ───────────────────────────────────────────────────
function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mt-3 flex flex-col gap-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-right"
          >
            <span className="text-sm font-semibold text-[#1a1a1a] flex-1">{faq.q}</span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"
              className={`flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {open === i && (
            <div className="px-4 pb-4 border-t border-gray-50">
              <p className="text-sm text-gray-500 leading-relaxed pt-3">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Status Badge ───────────────────────────────────────────────
const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  "جاري التمويل": { bg: "bg-blue-50",      text: "text-blue-600",   dot: "bg-blue-500",   label: "جاري التمويل" },
  "نشط":          { bg: "bg-[#e8f5e9]",    text: "text-[#2d7b33]", dot: "bg-[#2d7b33]",  label: "نشط" },
  "مكتمل":        { bg: "bg-gray-100",     text: "text-gray-500",  dot: "bg-gray-400",   label: "مكتمل" },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusConfig[status] ?? statusConfig["نشط"];
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} text-xs font-bold px-3 py-1.5 rounded-full`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
      {s.label}
    </span>
  );
}

// ─── Back Bar (for inner steps) ──────────────────────────────────
function BackBar({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="bg-white flex items-center px-5 py-4 border-b border-gray-100 relative">
      <button onClick={onBack} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center z-10">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
      <p className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#1a1a1a] pointer-events-none">
        {title}
      </p>
    </div>
  );
}

// ─── Lightbox ────────────────────────────────────────────────────
function Lightbox({
  images, index, onClose, onPrev, onNext,
}: {
  images: string[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 flex-shrink-0">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <span className="text-white text-sm font-medium">{index + 1} / {images.length}</span>
        <div className="w-10" />
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center relative px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt=""
          className="w-full max-h-full object-contain rounded-2xl"
        />
        {/* Prev / Next tap zones */}
        <button
          onClick={onPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          onClick={onNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 px-5 py-5 overflow-x-auto scrollbar-hide flex-shrink-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => {/* handled via onPrev/onNext — can extend */}}
            className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === index ? "border-white" : "border-transparent opacity-50"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Photo Gallery ───────────────────────────────────────────────
function PhotoGallery({
  images, saved, onToggleSave, onBack,
}: {
  images: string[]; saved: boolean; onToggleSave: () => void; onBack: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <>
      <div className="relative h-80 overflow-hidden bg-black select-none">
        {/* Images (slide) */}
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${current * 100}%)`, direction: "ltr" }}
        >
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="w-full h-full object-cover flex-shrink-0"
              style={{ minWidth: "100%" }}
            />
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30 pointer-events-none" />

        {/* ── Header bar (back + title + bookmark) ── */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-12 pb-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <span className="text-white text-sm font-bold drop-shadow-sm">تفاصيل الفرصة</span>

          <button
            onClick={onToggleSave}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center"
          >
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill={saved ? "white" : "none"}
              stroke="white" strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        </div>

        {/* ── Tap zones (prev / next) ── */}
        <button
          onClick={prev}
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
          aria-label="السابق"
        />
        <button
          onClick={next}
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
          aria-label="التالي"
        />

        {/* ── Open lightbox tap (center) ── */}
        <button
          onClick={() => setLightbox(true)}
          className="absolute left-1/3 right-1/3 top-0 bottom-0 z-10"
          aria-label="فتح معرض الصور"
        />

        {/* ── Expand icon ── */}
        <button
          onClick={() => setLightbox(true)}
          className="absolute bottom-14 left-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-20"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>

        {/* ── Image counter ── */}
        <div className="absolute bottom-14 right-4 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 z-20">
          <span className="text-white text-xs font-medium">{current + 1} / {images.length}</span>
        </div>

        {/* ── Dot indicators ── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${
                i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/45"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={images}
          index={current}
          onClose={() => setLightbox(false)}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}

// ─── Summary Card ────────────────────────────────────────────────
function SummaryCard() {
  const rows = [
    { label: "نوع العقار",        value: opp.type },
    { label: "الدخل الشهري",     value: `${opp.monthlyIncome.toLocaleString()} ريال`,  green: true },
    { label: "قيمة الحصة",       value: `${opp.shareAmount.toLocaleString()} ريال` },
    { label: "العائد السنوي",    value: `${opp.annualReturn}%`,                         green: true },
    { label: "مدة العقد",        value: opp.duration },
    { label: "الإجمالي المستحق", value: `${opp.shareAmount.toLocaleString()} ريال`,    bold: true },
  ];
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-l from-[#1f5a24] to-[#2d7b33] px-5 py-4">
        <p className="text-white font-extrabold text-base">{opp.title}</p>
        <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
          {opp.location}
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm text-gray-500">{r.label}</span>
            <span className={`text-sm font-bold ${r.green ? "text-[#2d7b33]" : r.bold ? "text-[#1a1a1a] text-base" : "text-[#1a1a1a]"}`}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Geometric Tree (Success Icon) ──────────────────────────────
function GeometricTree() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      {/* Top crystal/diamond */}
      <polygon points="60,8 76,32 60,42 44,32" fill="white" opacity="0.9" />
      {/* Left branch */}
      <polygon points="44,32 60,42 42,58 26,48" fill="white" opacity="0.75" />
      {/* Right branch */}
      <polygon points="76,32 94,48 78,58 60,42" fill="white" opacity="0.75" />
      {/* Left lower */}
      <polygon points="42,58 60,42 60,70 36,72" fill="white" opacity="0.6" />
      {/* Right lower */}
      <polygon points="78,58 60,42 60,70 84,72" fill="white" opacity="0.6" />
      {/* Center face */}
      <polygon points="60,42 78,58 60,70 42,58" fill="white" opacity="0.85" />
      {/* Trunk */}
      <rect x="55" y="70" width="10" height="28" rx="5" fill="white" opacity="0.5" />
      {/* Base dots */}
      <circle cx="40" cy="105" r="4" fill="white" opacity="0.35" />
      <circle cx="60" cy="108" r="5" fill="white" opacity="0.35" />
      <circle cx="80" cy="105" r="4" fill="white" opacity="0.35" />
    </svg>
  );
}

// ─── Main ────────────────────────────────────────────────────────
export default function OpportunityPage() {
  const [step, setStep] = useState<Step>("detail");
  const [agreed, setAgreed] = useState(false);
  const [saved, setSaved] = useState(false);
  const hasBalance = WALLET_BALANCE >= opp.shareAmount;

  // ══════════════════════════════════════════════
  // SUCCESS
  // ══════════════════════════════════════════════
  if (step === "success") {
    return (
      <AppShell>
        <div className="relative min-h-screen bg-[#2d7b33] flex flex-col items-center justify-center px-6 text-center font-[family-name:var(--font-tajawal)] overflow-hidden">
          {/* Geometric background shapes */}
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/5 -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 -translate-x-1/4 translate-y-1/4" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />

          {/* Hex grid subtle pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(60deg,white 0,white 1px,transparent 0,transparent 40px),repeating-linear-gradient(-60deg,white 0,white 1px,transparent 0,transparent 40px)" }} />

          <div className="relative z-10 flex flex-col items-center">
            {/* Geometric tree icon */}
            <div className="mb-6">
              <GeometricTree />
            </div>

            <h1 className="text-3xl font-extrabold text-white mb-3">أنت الآن جزء منها!</h1>
            <p className="text-white/80 text-base mb-1">عقدك الآن نشط</p>
            <p className="text-white/50 text-sm mb-10">استرخ وراقب ذلك ينمو 🌱</p>

            {/* Summary pill */}
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-7 py-5 mb-8 w-full max-w-xs">
              <p className="text-white/60 text-xs mb-1">{opp.title}</p>
              <p className="text-white font-extrabold text-2xl">{opp.shareAmount.toLocaleString()} ريال</p>
              <p className="text-white/60 text-xs mt-1">دخل شهري: {opp.monthlyIncome.toLocaleString()} ريال</p>
            </div>

            <Link href="/portfolio" className="w-full max-w-xs bg-white text-[#2d7b33] font-extrabold py-4 rounded-2xl text-center hover:bg-[#f0faf0] transition-colors mb-3 block">
              عرض محفظتي
            </Link>
            <Link href="/opportunities" className="text-white/50 text-sm hover:text-white transition-colors">
              العودة للفرص
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  // ══════════════════════════════════════════════
  // CONFIRM
  // ══════════════════════════════════════════════
  if (step === "confirm") {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#f5f5f5] pb-28 font-[family-name:var(--font-tajawal)]">
          <BackBar onBack={() => setStep("contract")} title="تأكيد الاستثمار" />

          <div className="px-4 pt-5 flex flex-col gap-4">
            {/* Warning card */}
            <div className="bg-[#fffbeb] border border-[#f59e0b]/25 rounded-2xl p-5 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#fef3c7] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[#92400e] mb-1">مراجعة نهائية</p>
                <p className="text-xs text-[#b45309] leading-relaxed">
                  هذه الخطوة لا يمكن التراجع عنها. تأكد من مراجعة جميع التفاصيل بعناية. سيتم خصم المبلغ فوراً عند الضغط على زر الاستثمار.
                </p>
              </div>
            </div>

            {/* Summary */}
            <SummaryCard />

            {/* Balance after */}
            <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">الرصيد المتبقي بعد الاستثمار</span>
              <span className="text-sm font-extrabold text-[#1a1a1a]">
                {(WALLET_BALANCE - opp.shareAmount).toLocaleString()} ريال
              </span>
            </div>
          </div>

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-5 z-50">
            <button
              onClick={() => setStep("success")}
              className="w-full bg-[#2d7b33] text-white font-extrabold py-4 rounded-2xl hover:bg-[#1f5a24] transition-colors text-base"
            >
              الاستمرار في العملية
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // ══════════════════════════════════════════════
  // CONTRACT REVIEW
  // ══════════════════════════════════════════════
  if (step === "contract") {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#f5f5f5] pb-28 font-[family-name:var(--font-tajawal)]">
          <BackBar onBack={() => setStep("detail")} title="تفاصيل العقد" />

          <div className="px-4 pt-5 flex flex-col gap-4">
            <p className="text-xs text-gray-400 px-1">راجع تفاصيل العقد بعناية قبل المتابعة</p>

            {/* Contract summary */}
            <SummaryCard />

            {/* Wallet balance */}
            <div className={`rounded-2xl p-5 ${hasBalance ? "bg-[#e8f5e9] border border-[#2d7b33]/20" : "bg-[#fff0f0] border border-red-200"}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-500">رصيد محفظتك</span>
                <span className={`text-base font-extrabold ${hasBalance ? "text-[#2d7b33]" : "text-red-500"}`}>
                  {WALLET_BALANCE.toLocaleString()} ريال
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">المبلغ المطلوب</span>
                <span className="text-sm font-bold text-[#1a1a1a]">{opp.shareAmount.toLocaleString()} ريال</span>
              </div>
              {!hasBalance && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                  رصيد غير كافٍ — تحتاج {(opp.shareAmount - WALLET_BALANCE).toLocaleString()} ريال إضافية
                </p>
              )}
            </div>

            {/* Agreement checkbox */}
            <button
              onClick={() => setAgreed(!agreed)}
              className={`flex items-center gap-3 bg-white rounded-2xl p-4 border-2 transition-all ${agreed ? "border-[#2d7b33]" : "border-gray-200"}`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${agreed ? "bg-[#2d7b33]" : "bg-gray-100 border border-gray-300"}`}>
                {agreed && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-600 text-right flex-1">
                أوافق على{" "}
                <span className="text-[#2d7b33] font-semibold">الشروط والأحكام</span>
                {" "}وأقر بأنني قرأت تفاصيل العقد كاملةً
              </p>
            </button>
          </div>

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-5 z-50">
            {hasBalance ? (
              <button
                disabled={!agreed}
                onClick={() => setStep("confirm")}
                className={`w-full font-extrabold py-4 rounded-2xl transition-all text-base ${agreed ? "bg-[#2d7b33] text-white hover:bg-[#1f5a24]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                {agreed ? "استثمر الآن" : "وافق على الشروط للمتابعة"}
              </button>
            ) : (
              <Link
                href="/wallet"
                className="block w-full bg-[#1a1a1a] text-white font-extrabold py-4 rounded-2xl text-center text-base"
              >
                شحن المحفظة
              </Link>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  // ══════════════════════════════════════════════
  // OPPORTUNITY DETAILS
  // ══════════════════════════════════════════════
  return (
    <AppShell>
      <div className="min-h-screen bg-[#f5f5f5] pb-28 font-[family-name:var(--font-tajawal)]">

        {/* Header + Photo Gallery */}
        <PhotoGallery
          images={opp.images}
          saved={saved}
          onToggleSave={() => setSaved((s) => !s)}
          onBack={() => window.history.back()}
        />

        <div className="flex flex-col gap-2.5">

          {/* ══ Section 3: Identity ══════════════════════════════ */}
          <div className="bg-white px-5 pt-5 pb-4">
            {/* Status badge */}
            <div className="mb-3">
              <StatusBadge status={opp.status} />
            </div>

            {/* Name */}
            <h1 className="text-xl font-extrabold text-[#1a1a1a] leading-tight mb-1.5">
              {opp.title}
            </h1>

            {/* Location */}
            <p className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {opp.location}
            </p>

            {/* Short description */}
            <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
              {opp.description}
            </p>
          </div>

          {/* ══ Section 4: Key Indicators ════════════════════════ */}
          <div className="bg-white px-5 py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">المؤشرات الرئيسية</p>
            <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100">
              <div className="text-center px-3 first:pr-0 last:pl-0">
                <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center mx-auto mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d7b33" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <p className="text-lg font-extrabold text-[#2d7b33]">{opp.annualReturn}%</p>
                <p className="text-xs text-gray-400 mt-0.5">العائد السنوي</p>
              </div>
              <div className="text-center px-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <p className="text-base font-extrabold text-[#1a1a1a]">{opp.duration}</p>
                <p className="text-xs text-gray-400 mt-0.5">مدة الاستثمار</p>
              </div>
              <div className="text-center px-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </div>
                <p className="text-base font-extrabold text-[#1a1a1a]">{(opp.totalValue / 1000000).toFixed(0)}M</p>
                <p className="text-xs text-gray-400 mt-0.5">حجم الصفقة (ريال)</p>
              </div>
            </div>
          </div>

          {/* ══ Section 5: User Investment Summary ═══════════════ */}
          <div className="bg-white px-5 py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">ملخص الاستثمار</p>
            <div className="grid grid-cols-2 gap-2.5">

              {/* Monthly income — highlighted */}
              <div className="col-span-2 bg-gradient-to-l from-[#1f5a24] to-[#2d7b33] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs mb-0.5">متوسط الدخل الشهري</p>
                  <p className="text-white font-extrabold text-2xl">{opp.monthlyIncome.toLocaleString()} <span className="text-sm font-medium opacity-70">ريال</span></p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </div>
              </div>

              {/* Share value */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">قيمة الحصة</p>
                <p className="text-base font-extrabold text-[#1a1a1a]">{opp.shareAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">ريال</p>
              </div>

              {/* Min investment */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">الحد الأدنى</p>
                <p className="text-base font-extrabold text-[#1a1a1a]">{opp.minInvestment.toLocaleString()}</p>
                <p className="text-xs text-gray-400">ريال</p>
              </div>

              {/* Capital recovery */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">استرداد رأس المال</p>
                <p className="text-base font-extrabold text-[#1a1a1a]">{opp.capitalRecovery}</p>
                <p className="text-xs text-gray-400">شهراً</p>
              </div>

              {/* Distribution count */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">عدد التوزيعات</p>
                <p className="text-base font-extrabold text-[#1a1a1a]">{opp.distributionCount}</p>
                <p className="text-xs text-gray-400">دفعة</p>
              </div>

              {/* Total deal */}
              <div className="col-span-2 bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">إجمالي حجم الصفقة</p>
                  <p className="text-base font-extrabold text-[#1a1a1a]">{opp.totalValue.toLocaleString()} <span className="text-xs font-medium text-gray-400">ريال</span></p>
                </div>
                <span className="text-xs bg-[#e8f5e9] text-[#2d7b33] font-bold px-3 py-1.5 rounded-full">{opp.type}</span>
              </div>
            </div>
          </div>

          {/* ══ Section 6: Funding Progress ══════════════════════ */}
          <div className="bg-white px-5 py-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">حالة التمويل</p>
              <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-full">
                {opp.status}
              </span>
            </div>

            {/* Big percentage */}
            <div className="flex items-end gap-2 mt-3 mb-3">
              <span className="text-4xl font-extrabold text-[#1a1a1a]">{opp.funded}%</span>
              <span className="text-sm text-gray-400 mb-1.5">مكتمل</span>
            </div>

            {/* Progress bar */}
            <div className="relative bg-gray-100 rounded-full h-3 overflow-hidden mb-3">
              <div
                className="bg-gradient-to-l from-[#4aab52] to-[#2d7b33] h-3 rounded-full"
                style={{ width: `${opp.funded}%` }}
              />
              {/* Milestone marker at 75% */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-white/60" style={{ left: "75%" }} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center bg-[#e8f5e9] rounded-xl py-3">
                <p className="text-sm font-extrabold text-[#2d7b33]">
                  {(opp.totalValue * opp.funded / 100 / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-400 mt-0.5">تم تغطيته</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl py-3">
                <p className="text-sm font-extrabold text-[#1a1a1a]">
                  {(opp.totalValue * (100 - opp.funded) / 100 / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-400 mt-0.5">المتبقي</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl py-3">
                <p className="text-sm font-extrabold text-[#1a1a1a]">{opp.totalInvestors}</p>
                <p className="text-xs text-gray-400 mt-0.5">مستثمر</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              ينتهي التمويل في {opp.fundingDeadline}
            </p>
          </div>

          {/* ══ Section 7: About ══════════════════════════════════ */}
          <div className="bg-white px-5 py-5">
            <SectionTitle icon="📋" title="نبذة عن الفرصة" />
            <p className="text-sm text-gray-600 leading-[2] mt-3">
              {opp.description}
            </p>
            <p className="text-sm text-gray-600 leading-[2] mt-2">
              تعمل الفرصة على توليد دخل إيجاري ثابت من خلال تأجير المساحات المكتبية لشركات محلية ودولية. تم طرح الفرصة لتمكين المستثمرين الأفراد من المشاركة في سوق العقارات التجارية برأس مال منخفض نسبياً وعائد موزَّع شهرياً.
            </p>
          </div>

          {/* ══ Section 8: Property Details ══════════════════════ */}
          <div className="bg-white px-5 py-5">
            <SectionTitle icon="🏢" title="تفاصيل الأصل العقاري" />
            <div className="mt-3 divide-y divide-gray-50">
              {[
                { label: "نوع العقار",        value: opp.type },
                { label: "المدينة / الحي",    value: `${opp.propertyDetails.city} — ${opp.propertyDetails.district}` },
                { label: "المساحة الإجمالية", value: opp.propertyDetails.area },
                { label: "عدد الطوابق",       value: opp.propertyDetails.floors },
                { label: "نسبة الإشغال",     value: opp.propertyDetails.occupancy },
                { label: "الاستخدام",         value: opp.propertyDetails.usage },
                { label: "المطور",             value: opp.propertyDetails.developer },
                { label: "حالة العقار",        value: opp.propertyDetails.age },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-3">
                  <span className="text-sm text-gray-400">{row.label}</span>
                  <span className="text-sm font-semibold text-[#1a1a1a]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══ Section 9: Returns Mechanism ═════════════════════ */}
          <div className="bg-white px-5 py-5">
            <SectionTitle icon="💰" title="آلية العوائد" />
            <div className="mt-3 flex flex-col gap-3">
              <div className="bg-[#e8f5e9] rounded-2xl p-4">
                <p className="text-sm font-bold text-[#1a1a1a] mb-1">كيف يتحقق العائد؟</p>
                <p className="text-sm text-gray-600 leading-relaxed">{opp.returns.how}</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-gray-50 rounded-xl p-3.5">
                  <p className="text-xs text-gray-400 mb-1">جدول التوزيع</p>
                  <p className="text-sm font-extrabold text-[#1a1a1a]">{opp.returns.schedule}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5">
                  <p className="text-xs text-gray-400 mb-1">نوع العائد</p>
                  <p className="text-sm font-extrabold text-[#1a1a1a]">{opp.returns.type}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">أول توزيع متوقع</p>
                <p className="text-sm font-semibold text-[#1a1a1a]">{opp.returns.firstPayout}</p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed px-1">{opp.returns.note}</p>
            </div>
          </div>

          {/* ══ Section 10: Risks ════════════════════════════════ */}
          <div className="bg-white px-5 py-5">
            <SectionTitle icon="⚠️" title="المخاطر والتنبيهات" />
            <div className="mt-3 bg-[#fffbeb] border border-[#fbbf24]/25 rounded-2xl p-4 flex flex-col gap-3">
              {opp.risks.map((risk, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-[#fef3c7] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-[#d97706]">{i + 1}</span>
                  </div>
                  <p className="text-sm text-[#92400e] leading-relaxed">{risk}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ══ Section 11: Documents ════════════════════════════ */}
          <div className="bg-white px-5 py-5">
            <SectionTitle icon="📄" title="المستندات" />
            <div className="mt-3 flex flex-col gap-2">
              {opp.documents.map((doc) => (
                <button
                  key={doc.name}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 hover:border-[#2d7b33]/30 hover:bg-[#f8fef8] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d7b33" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-semibold text-[#1a1a1a]">{doc.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{doc.type} · {doc.size}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#2d7b33]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span className="text-xs font-bold">تحميل</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ══ Section 12: FAQ ═══════════════════════════════════ */}
          <div className="bg-white px-5 py-5">
            <SectionTitle icon="❓" title="الأسئلة الشائعة" />
            <FaqList faqs={opp.faqs} />
          </div>

          {/* Bottom spacer for CTA */}
          <div className="h-2" />

        </div>

        {/* CTA */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-4 z-50">
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <p className="text-xs text-gray-400">الحصة</p>
              <p className="text-base font-extrabold text-[#1a1a1a]">{opp.shareAmount.toLocaleString()} ريال</p>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400">الدخل الشهري</p>
              <p className="text-base font-extrabold text-[#2d7b33]">{opp.monthlyIncome.toLocaleString()} ريال</p>
            </div>
          </div>
          <button
            onClick={() => setStep("contract")}
            className="w-full bg-[#2d7b33] text-white font-extrabold py-4 rounded-2xl hover:bg-[#1f5a24] transition-colors text-base"
          >
            امتلك حصتك
          </button>
        </div>

      </div>
    </AppShell>
  );
}
