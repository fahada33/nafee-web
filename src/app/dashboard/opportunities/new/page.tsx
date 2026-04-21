"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────
type DocEntry = { name: string; file: string; blob?: File; uploaded?: string };
type FaqEntry = { q: string; a: string };

// ─── Helpers ─────────────────────────────────────────────────────
function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="pb-4 mb-5 border-b border-gray-50">
        <h2 className="font-extrabold text-[#1a1a1a] text-base">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d7b33] transition-colors bg-gray-50";
const selectCls = inputCls;
const textareaCls = inputCls + " resize-none";

// ─── Main ─────────────────────────────────────────────────────────
export default function NewOpportunityPage() {
  const router = useRouter();
  const [saving, setSaving]       = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // § 1 — Identity
  const [identity, setIdentity] = useState({
    title: "", type: "", city: "", district: "", status: "جاري التمويل", description: "",
  });

  // § 2 — Key indicators
  const [indicators, setIndicators] = useState({
    annualReturn: "", duration: "", totalValue: "",
  });

  // § 3 — Investment summary
  const [invest, setInvest] = useState({
    monthlyIncome: "", shareAmount: "", minShares: "1", minInvestment: "", capitalRecovery: "", distributionCount: "",
  });

  // § 4 — Funding
  const [funding, setFunding] = useState({
    fundingGoal: "", fundingDeadline: "",
  });

  // § 5 — Property details
  const [property, setProperty] = useState({
    area: "", floors: "", occupancy: "", developer: "", usage: "", age: "",
  });

  // § 6 — Returns mechanism
  const [returns, setReturns] = useState({
    how: "", schedule: "شهري", returnType: "مستهدف", firstPayout: "", note: "",
  });

  // § 7 — Risks (dynamic list)
  const [risks, setRisks] = useState<string[]>(["الدخل الإيجاري المعروض مستهدف وليس مضموناً قانونياً"]);
  const addRisk    = () => setRisks((r) => [...r, ""]);
  const removeRisk = (i: number) => setRisks((r) => r.filter((_, idx) => idx !== i));
  const editRisk   = (i: number, v: string) => setRisks((r) => r.map((x, idx) => idx === i ? v : x));

  // § 8 — Documents (dynamic list)
  const [docs, setDocs] = useState<DocEntry[]>([
    { name: "ملخص الفرصة العقارية", file: "" },
    { name: "نشرة الإصدار الكاملة", file: "" },
  ]);
  const addDoc    = () => setDocs((d) => [...d, { name: "", file: "" }]);
  const removeDoc = (i: number) => setDocs((d) => d.filter((_, idx) => idx !== i));
  const editDoc   = (i: number, field: keyof DocEntry, v: string) =>
    setDocs((d) => d.map((x, idx) => idx === i ? { ...x, [field]: v } : x));

  // § 9 — FAQ (dynamic list)
  const [faqs, setFaqs] = useState<FaqEntry[]>([
    { q: "متى أستلم الدخل الإيجاري؟", a: "" },
    { q: "هل أستطيع التنازل عن وحدة منفعتي مبكراً؟", a: "" },
  ]);
  const addFaq    = () => setFaqs((f) => [...f, { q: "", a: "" }]);
  const removeFaq = (i: number) => setFaqs((f) => f.filter((_, idx) => idx !== i));
  const editFaq   = (i: number, field: keyof FaqEntry, v: string) =>
    setFaqs((f) => f.map((x, idx) => idx === i ? { ...x, [field]: v } : x));

  // § 10 — Risk level
  const [riskLevel, setRiskLevel] = useState("متوسط");

  async function handlePublish(statusVal: string) {
    setSaving(true);

    // Upload images to Supabase Storage
    let imageUrl = "";
    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
      const ext  = file.name.split(".").pop();
      const path = `opportunities/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("opportunities").upload(path, file, { upsert: true });
      if (!error) {
        const { data: pub } = supabase.storage.from("opportunities").getPublicUrl(path);
        uploadedUrls.push(pub.publicUrl);
      }
    }
    if (uploadedUrls.length > 0) imageUrl = uploadedUrls[0];

    // Upload PDF documents
    const uploadedDocs: { name: string; url: string }[] = [];
    for (const doc of docs) {
      if (!doc.blob || !doc.name.trim()) continue;
      const path = `documents/${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`;
      const { error } = await supabase.storage.from("opportunities").upload(path, doc.blob, {
        upsert: true,
        contentType: "application/pdf",
      });
      if (!error) {
        const { data: pub } = supabase.storage.from("opportunities").getPublicUrl(path);
        uploadedDocs.push({ name: doc.name.trim(), url: pub.publicUrl });
      }
    }

    await supabase.from("opportunities").insert({
      title:          identity.title,
      location:       `${identity.city}، ${identity.district}`.trim().replace(/،\s*$/, ""),
      type:           identity.type,
      status:         statusVal === "نشر" ? "funding" : "draft",
      description:    identity.description,
      return_percent: parseFloat(indicators.annualReturn) || 0,
      duration_years: parseInt(indicators.duration) || 0,
      total_value:    parseFloat(indicators.totalValue) || 0,
      monthly_income: parseFloat(invest.monthlyIncome) || 0,
      share_amount:   parseFloat(invest.shareAmount) || 0,
      min_shares:     parseInt(invest.minShares) || 1,
      funded_percent: 0,
      investors_count: 0,
      featured:       false,
      image_url:      imageUrl,
      documents:      uploadedDocs,
    });
    setSaving(false);
    router.push("/dashboard/opportunities");
  }

  const types        = ["مكاتب تجارية", "تجزئة تجارية", "سكني", "مستودعات", "ضيافة", "صحة", "تعليم"];
  const schedules    = ["شهري", "ربع سنوي", "نصف سنوي", "سنوي"];
  const returnTypes  = ["مستهدف", "ثابت مضمون", "متغير"];
  const statusOpts   = ["جاري التمويل", "نشط", "مكتمل", "مسودة"];
  const riskLevels   = ["منخفض", "متوسط", "مرتفع"];

  return (
    <div className="max-w-3xl">

      {/* Back */}
      <Link href="/dashboard/opportunities" className="flex items-center gap-2 text-gray-400 hover:text-[#2d7b33] transition-colors text-sm mb-6">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
        العودة للفرص
      </Link>

      <div className="flex flex-col gap-5">

        {/* ══════════════════════════════════════════════════════
            § 1 — الهوية
        ══════════════════════════════════════════════════════ */}
        <SectionCard title="هوية الفرصة" subtitle="الاسم والموقع والوصف المختصر الذي يظهر للمالك أولاً">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="اسم الفرصة / العقار" required>
                <input value={identity.title} onChange={(e) => setIdentity({ ...identity, title: e.target.value })}
                  placeholder="مثال: برج العليا التجاري" className={inputCls} />
              </Field>
            </div>
            <Field label="نوع العقار" required>
              <select value={identity.type} onChange={(e) => setIdentity({ ...identity, type: e.target.value })} className={selectCls}>
                <option value="">اختر النوع</option>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="حالة الفرصة" required>
              <select value={identity.status} onChange={(e) => setIdentity({ ...identity, status: e.target.value })} className={selectCls}>
                {statusOpts.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="المدينة" required>
              <input value={identity.city} onChange={(e) => setIdentity({ ...identity, city: e.target.value })}
                placeholder="مثال: الرياض" className={inputCls} />
            </Field>
            <Field label="الحي">
              <input value={identity.district} onChange={(e) => setIdentity({ ...identity, district: e.target.value })}
                placeholder="مثال: حي العليا" className={inputCls} />
            </Field>
            <div className="col-span-2">
              <Field label="الوصف المختصر" required>
                <textarea value={identity.description} onChange={(e) => setIdentity({ ...identity, description: e.target.value })}
                  placeholder="سطر أو سطرين يصفان الفرصة بشكل مختصر ومقنع…" rows={3} className={textareaCls} />
              </Field>
            </div>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════════════
            § 2 — المؤشرات الرئيسية
        ══════════════════════════════════════════════════════ */}
        <SectionCard title="المؤشرات الرئيسية" subtitle="تُعرض في الشريط المختصر أعلى صفحة الفرصة">
          <div className="grid grid-cols-3 gap-4">
            <Field label="الدخل الإيجاري السنوي (%)" required>
              <div className="relative">
                <input type="number" value={indicators.annualReturn}
                  onChange={(e) => setIndicators({ ...indicators, annualReturn: e.target.value })}
                  placeholder="12" className={inputCls + " pl-8"} />
                <span className="absolute left-3 top-3 text-gray-400 text-sm">%</span>
              </div>
            </Field>
            <Field label="مدة العقد" required>
              <input value={indicators.duration} onChange={(e) => setIndicators({ ...indicators, duration: e.target.value })}
                placeholder="10 سنوات" className={inputCls} />
            </Field>
            <Field label="حجم الصفقة (ريال)" required>
              <input type="number" value={indicators.totalValue}
                onChange={(e) => setIndicators({ ...indicators, totalValue: e.target.value })}
                placeholder="5000000" className={inputCls} />
            </Field>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════════════
            § 3 — ملخص التملك
        ══════════════════════════════════════════════════════ */}
        <SectionCard title="ملخص التملك" subtitle="الأرقام التي يراها المالك في بطاقة ملخص التملك">
          <div className="grid grid-cols-2 gap-4">
            <Field label="متوسط الدخل الشهري (ريال)" required>
              <div className="relative">
                <input type="number" value={invest.monthlyIncome}
                  onChange={(e) => setInvest({ ...invest, monthlyIncome: e.target.value })}
                  placeholder="5458" className={inputCls + " pl-12"} />
                <span className="absolute left-3 top-3 text-gray-400 text-xs">ريال</span>
              </div>
            </Field>
            <Field label="قيمة الحصة (ريال)" required>
              <div className="relative">
                <input type="number" value={invest.shareAmount}
                  onChange={(e) => setInvest({ ...invest, shareAmount: e.target.value })}
                  placeholder="25000" className={inputCls + " pl-12"} />
                <span className="absolute left-3 top-3 text-gray-400 text-xs">ريال</span>
              </div>
            </Field>
            <Field label="الحد الأدنى للوحدات" required>
              <input type="number" value={invest.minShares} min="1"
                onChange={(e) => setInvest({ ...invest, minShares: e.target.value })}
                placeholder="1" className={inputCls} />
            </Field>
            <Field label="الحد الأدنى للتملك (ريال)" required>
              <div className="relative">
                <input type="number" value={invest.minInvestment}
                  onChange={(e) => setInvest({ ...invest, minInvestment: e.target.value })}
                  placeholder="25000" className={inputCls + " pl-12"} />
                <span className="absolute left-3 top-3 text-gray-400 text-xs">ريال</span>
              </div>
            </Field>
            <Field label="استرداد رأس المال (شهر)">
              <div className="relative">
                <input type="number" value={invest.capitalRecovery}
                  onChange={(e) => setInvest({ ...invest, capitalRecovery: e.target.value })}
                  placeholder="54" className={inputCls + " pl-14"} />
                <span className="absolute left-3 top-3 text-gray-400 text-xs">شهراً</span>
              </div>
            </Field>
            <Field label="عدد التوزيعات الإجمالي">
              <div className="relative">
                <input type="number" value={invest.distributionCount}
                  onChange={(e) => setInvest({ ...invest, distributionCount: e.target.value })}
                  placeholder="120" className={inputCls + " pl-14"} />
                <span className="absolute left-3 top-3 text-gray-400 text-xs">دفعة</span>
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════════════
            § 4 — التمويل
        ══════════════════════════════════════════════════════ */}
        <SectionCard title="شريط التمويل" subtitle="هدف التمويل والموعد النهائي">
          <div className="grid grid-cols-2 gap-4">
            <Field label="هدف التمويل (ريال)" required>
              <div className="relative">
                <input type="number" value={funding.fundingGoal}
                  onChange={(e) => setFunding({ ...funding, fundingGoal: e.target.value })}
                  placeholder="5000000" className={inputCls + " pl-12"} />
                <span className="absolute left-3 top-3 text-gray-400 text-xs">ريال</span>
              </div>
            </Field>
            <Field label="تاريخ انتهاء التمويل" required>
              <input type="date" value={funding.fundingDeadline}
                onChange={(e) => setFunding({ ...funding, fundingDeadline: e.target.value })}
                className={inputCls} />
            </Field>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════════════
            § 5 — تفاصيل الأصل العقاري
        ══════════════════════════════════════════════════════ */}
        <SectionCard title="تفاصيل الأصل العقاري" subtitle="معلومات العقار التي تظهر في قسم تفاصيل الأصل">
          <div className="grid grid-cols-2 gap-4">
            <Field label="المساحة الإجمالية">
              <input value={property.area} onChange={(e) => setProperty({ ...property, area: e.target.value })}
                placeholder="4,200 م²" className={inputCls} />
            </Field>
            <Field label="عدد الطوابق">
              <input value={property.floors} onChange={(e) => setProperty({ ...property, floors: e.target.value })}
                placeholder="18 طابقاً" className={inputCls} />
            </Field>
            <Field label="نسبة الإشغال">
              <div className="relative">
                <input value={property.occupancy} onChange={(e) => setProperty({ ...property, occupancy: e.target.value })}
                  placeholder="94" className={inputCls + " pl-8"} />
                <span className="absolute left-3 top-3 text-gray-400 text-sm">%</span>
              </div>
            </Field>
            <Field label="الجهة المطورة">
              <input value={property.developer} onChange={(e) => setProperty({ ...property, developer: e.target.value })}
                placeholder="مجموعة الراجحي للتطوير" className={inputCls} />
            </Field>
            <Field label="الاستخدام">
              <input value={property.usage} onChange={(e) => setProperty({ ...property, usage: e.target.value })}
                placeholder="تجاري — مكاتب مؤجرة" className={inputCls} />
            </Field>
            <Field label="حالة / عمر العقار">
              <input value={property.age} onChange={(e) => setProperty({ ...property, age: e.target.value })}
                placeholder="تحت الإنشاء (2024)" className={inputCls} />
            </Field>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════════════
            § 6 — آلية الدخل الإيجاري
        ══════════════════════════════════════════════════════ */}
        <SectionCard title="آلية الدخل الإيجاري" subtitle="تُعرض في قسم 'آلية الدخل الإيجاري' بصفحة الفرصة">
          <div className="flex flex-col gap-4">
            <Field label="كيف يتحقق الدخل الإيجاري؟" required>
              <textarea value={returns.how} onChange={(e) => setReturns({ ...returns, how: e.target.value })}
                placeholder="اشرح مصدر الإيراد، مثلاً: إيرادات الإيجار الشهري المحصّلة من المستأجرين…"
                rows={3} className={textareaCls} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="جدول التوزيع" required>
                <select value={returns.schedule} onChange={(e) => setReturns({ ...returns, schedule: e.target.value })} className={selectCls}>
                  {schedules.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="نوع الدخل" required>
                <select value={returns.returnType} onChange={(e) => setReturns({ ...returns, returnType: e.target.value })} className={selectCls}>
                  {returnTypes.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
            </div>
            <Field label="أول توزيع متوقع">
              <input value={returns.firstPayout} onChange={(e) => setReturns({ ...returns, firstPayout: e.target.value })}
                placeholder="مثال: بعد 30 يوماً من اكتمال التمويل" className={inputCls} />
            </Field>
            <Field label="ملاحظة على الدخل">
              <textarea value={returns.note} onChange={(e) => setReturns({ ...returns, note: e.target.value })}
                placeholder="أي توضيح إضافي للمالك…" rows={2} className={textareaCls} />
            </Field>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════════════
            § 7 — المخاطر + مستوى المخاطرة
        ══════════════════════════════════════════════════════ */}
        <SectionCard title="المخاطر والتنبيهات" subtitle="تُعرض في قسم التحذيرات بصفحة الفرصة">
          <div className="flex flex-col gap-4">

            {/* Risk level */}
            <Field label="مستوى المخاطرة العام">
              <div className="flex gap-2">
                {riskLevels.map((r) => (
                  <button key={r} type="button" onClick={() => setRiskLevel(r)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors
                      ${riskLevel === r
                        ? r === "منخفض" ? "border-[#2d7b33] bg-[#e8f5e9] text-[#2d7b33]"
                        : r === "متوسط" ? "border-orange-400 bg-orange-50 text-orange-600"
                        : "border-red-400 bg-red-50 text-red-600"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Field>

            {/* Dynamic risk list */}
            <div>
              <label className="text-sm font-medium text-[#1a1a1a] mb-2 block">قائمة المخاطر</label>
              <div className="flex flex-col gap-2">
                {risks.map((risk, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-400">
                      {i + 1}
                    </div>
                    <input value={risk} onChange={(e) => editRisk(i, e.target.value)}
                      placeholder="أدخل تحذيراً أو مخاطرة…" className={inputCls + " flex-1"} />
                    {risks.length > 1 && (
                      <button onClick={() => removeRisk(i)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addRisk} className="mt-2 flex items-center gap-1.5 text-sm text-[#2d7b33] hover:text-[#1f5a24] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                إضافة مخاطرة
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════════════
            § 8 — المستندات
        ══════════════════════════════════════════════════════ */}
        <SectionCard title="المستندات" subtitle="ملفات PDF تظهر في قسم المستندات للمالك">
          <div className="flex flex-col gap-3">
            {docs.map((doc, i) => (
              <div key={i} className="flex gap-3 items-center p-3 border border-gray-100 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d7b33" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <input value={doc.name} onChange={(e) => editDoc(i, "name", e.target.value)}
                  placeholder="اسم المستند" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d7b33] bg-gray-50" />
                <label className="flex items-center gap-1.5 text-xs text-[#2d7b33] font-semibold cursor-pointer bg-[#e8f5e9] px-3 py-2 rounded-lg hover:bg-[#d4edda] transition-colors whitespace-nowrap">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                  </svg>
                  رفع ملف
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setDocs((d) => d.map((x, idx) => idx === i ? { ...x, file: f.name, blob: f } : x));
                  }} />
                </label>
                {doc.file && <span className="text-xs text-gray-400 truncate max-w-[80px]">{doc.file}</span>}
                {docs.length > 1 && (
                  <button onClick={() => removeDoc(i)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button onClick={addDoc} className="flex items-center gap-1.5 text-sm text-[#2d7b33] hover:text-[#1f5a24] transition-colors mt-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              إضافة مستند
            </button>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════════════
            § 9 — الأسئلة الشائعة
        ══════════════════════════════════════════════════════ */}
        <SectionCard title="الأسئلة الشائعة" subtitle="تُعرض للمالك في نهاية صفحة الفرصة">
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 w-5">س{i + 1}</span>
                  <input value={faq.q} onChange={(e) => editFaq(i, "q", e.target.value)}
                    placeholder="السؤال…" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d7b33] bg-gray-50" />
                  {faqs.length > 1 && (
                    <button onClick={() => removeFaq(i)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-gray-400 w-5 pt-2">ج</span>
                  <textarea value={faq.a} onChange={(e) => editFaq(i, "a", e.target.value)}
                    placeholder="الإجابة…" rows={2}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d7b33] bg-gray-50 resize-none" />
                </div>
              </div>
            ))}
            <button onClick={addFaq} className="flex items-center gap-1.5 text-sm text-[#2d7b33] hover:text-[#1f5a24] transition-colors mt-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              إضافة سؤال
            </button>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════════════
            § 10 — الصور
        ══════════════════════════════════════════════════════ */}
        <SectionCard title="صور العقار" subtitle="تُعرض في معرض الصور أعلى صفحة الفرصة (حتى 10 صور)">
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-[#2d7b33] transition-colors cursor-pointer group">
            <div className="text-4xl mb-3">🖼️</div>
            <p className="text-sm font-medium text-gray-500 group-hover:text-[#2d7b33] transition-colors">اسحب الصور هنا أو انقر للرفع</p>
            <p className="text-xs text-gray-300 mt-1.5">PNG, JPG — حتى 10MB للصورة · أقصاه 10 صور</p>
            <label className="mt-4 inline-block bg-[#e8f5e9] text-[#2d7b33] text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#d4edda] transition-colors">
              اختر الصور
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))} />
            </label>
            {imageFiles.length > 0 && (
              <p className="mt-2 text-xs text-[#2d7b33] font-medium">{imageFiles.length} صورة محددة</p>
            )}
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════════════
            Actions
        ══════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-5 shadow-sm sticky bottom-4 z-10 border border-gray-100">
          <Link href="/dashboard/opportunities" className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
            إلغاء
          </Link>
          <div className="flex gap-3">
            <button onClick={() => handlePublish("مسودة")} disabled={saving}
              className="border border-gray-200 text-gray-600 font-medium px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center gap-1.5 disabled:opacity-50">
              حفظ كمسودة
            </button>
            <button onClick={() => handlePublish("نشر")} disabled={saving}
              className="bg-[#2d7b33] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors text-sm flex items-center gap-1.5 disabled:opacity-50">
              {saving ? "جاري الحفظ..." : "نشر الفرصة"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
