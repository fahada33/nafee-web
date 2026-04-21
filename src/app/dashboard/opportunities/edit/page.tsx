"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d7b33] transition-colors bg-gray-50";
const selectCls = inputCls;

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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="pb-4 mb-5 border-b border-gray-50">
        <h2 className="font-extrabold text-[#1a1a1a] text-base">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function EditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "", location: "", type: "", status: "funding",
    return_percent: "", duration_years: "", total_value: "",
    monthly_income: "", share_amount: "", funded_percent: "",
    investors_count: "", image_url: "", featured: false,
  });

  const types = ["مكاتب تجارية", "تجزئة تجارية", "سكني", "مستودعات", "ضيافة", "صحة", "تعليم"];
  const statuses = [
    { value: "funding", label: "جاري التمويل" },
    { value: "active", label: "نشط" },
    { value: "completed", label: "مكتمل" },
  ];

  useEffect(() => {
    if (!id) return;
    supabase.from("opportunities").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setForm({
        title: data.title ?? "",
        location: data.location ?? "",
        type: data.type ?? "",
        status: data.status ?? "funding",
        return_percent: data.return_percent?.toString() ?? "",
        duration_years: data.duration_years?.toString() ?? "",
        total_value: data.total_value?.toString() ?? "",
        monthly_income: data.monthly_income?.toString() ?? "",
        share_amount: data.share_amount?.toString() ?? "",
        funded_percent: data.funded_percent?.toString() ?? "",
        investors_count: data.investors_count?.toString() ?? "",
        image_url: data.image_url ?? "",
        featured: data.featured ?? false,
      });
      setLoading(false);
    });
  }, [id]);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true);
    let imageUrl = form.image_url;
    if (imageFile) {
      const ext  = imageFile.name.split(".").pop();
      const path = `opportunities/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("opportunities").upload(path, imageFile, { upsert: true });
      if (!error) {
        const { data: pub } = supabase.storage.from("opportunities").getPublicUrl(path);
        imageUrl = pub.publicUrl;
      }
    }
    await supabase.from("opportunities").update({
      title:          form.title,
      location:       form.location,
      type:           form.type,
      status:         form.status,
      return_percent: parseFloat(form.return_percent) || 0,
      duration_years: parseInt(form.duration_years) || 0,
      total_value:    parseFloat(form.total_value) || 0,
      monthly_income: parseFloat(form.monthly_income) || 0,
      share_amount:   parseFloat(form.share_amount) || 0,
      funded_percent: parseFloat(form.funded_percent) || 0,
      investors_count: parseInt(form.investors_count) || 0,
      image_url:      imageUrl,
      featured:       form.featured,
    }).eq("id", id!);
    setSaving(false);
    router.push("/dashboard/opportunities");
  }

  if (loading) return <div className="text-center py-20 text-gray-400">جاري التحميل...</div>;

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/opportunities" className="flex items-center gap-2 text-gray-400 hover:text-[#2d7b33] transition-colors text-sm mb-6">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        العودة للفرص
      </Link>

      <div className="flex flex-col gap-5">
        <SectionCard title="بيانات الفرصة">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="اسم الفرصة" required>
                <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="الموقع" required>
              <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} />
            </Field>
            <Field label="نوع العقار" required>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={selectCls}>
                <option value="">اختر النوع</option>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="الحالة" required>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={selectCls}>
                {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="مميزة">
              <div className="flex items-center gap-3 mt-2">
                <button type="button" onClick={() => set("featured", !form.featured)}
                  className={`w-12 h-6 rounded-full transition-colors ${form.featured ? "bg-[#2d7b33]" : "bg-gray-200"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.featured ? "translate-x-6" : "translate-x-0"}`} />
                </button>
                <span className="text-sm text-gray-500">{form.featured ? "نعم" : "لا"}</span>
              </div>
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="المؤشرات المالية">
          <div className="grid grid-cols-2 gap-4">
            <Field label="الدخل الإيجاري السنوي (%)"><input type="number" value={form.return_percent} onChange={(e) => set("return_percent", e.target.value)} className={inputCls} /></Field>
            <Field label="مدة العقد (سنوات)"><input type="number" value={form.duration_years} onChange={(e) => set("duration_years", e.target.value)} className={inputCls} /></Field>
            <Field label="حجم الصفقة (ريال)"><input type="number" value={form.total_value} onChange={(e) => set("total_value", e.target.value)} className={inputCls} /></Field>
            <Field label="الدخل الشهري (ريال)"><input type="number" value={form.monthly_income} onChange={(e) => set("monthly_income", e.target.value)} className={inputCls} /></Field>
            <Field label="قيمة الحصة (ريال)"><input type="number" value={form.share_amount} onChange={(e) => set("share_amount", e.target.value)} className={inputCls} /></Field>
            <Field label="نسبة التمويل (%)"><input type="number" value={form.funded_percent} onChange={(e) => set("funded_percent", e.target.value)} className={inputCls} /></Field>
            <Field label="عدد الملاك"><input type="number" value={form.investors_count} onChange={(e) => set("investors_count", e.target.value)} className={inputCls} /></Field>
          </div>
        </SectionCard>

        <SectionCard title="الصورة">
          <Field label="رفع صورة جديدة">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d7b33] font-medium hover:bg-[#e8f5e9] transition-colors w-fit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
              </svg>
              {imageFile ? imageFile.name : "اختر صورة"}
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
            </label>
          </Field>
          {(imageFile ? URL.createObjectURL(imageFile) : form.image_url) && (
            <img src={imageFile ? URL.createObjectURL(imageFile) : form.image_url}
              alt="" className="mt-3 w-full h-40 object-cover rounded-xl" />
          )}
        </SectionCard>

        <div className="flex items-center justify-between bg-white rounded-2xl p-5 shadow-sm sticky bottom-4 z-10 border border-gray-100">
          <Link href="/dashboard/opportunities" className="text-gray-400 text-sm hover:text-gray-600 transition-colors">إلغاء</Link>
          <button onClick={handleSave} disabled={saving}
            className="bg-[#2d7b33] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors text-sm disabled:opacity-50">
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditOpportunityPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">جاري التحميل...</div>}>
      <EditForm />
    </Suspense>
  );
}
