"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Opportunity = {
  id: string;
  title: string;
  location: string;
  type: string;
  status: string;
  return_percent: number;
  duration_years: number;
  funded_percent: number;
  investors_count: number;
  share_amount: number;
  monthly_income: number;
  total_value: number;
  featured: boolean;
  created_at: string;
};

const statusColors: Record<string, string> = {
  funding:   "bg-[#e8f5e9] text-[#2d7b33]",
  active:    "bg-purple-50 text-purple-600",
  completed: "bg-gray-100 text-gray-500",
};

const statusLabels: Record<string, string> = {
  funding:   "جاري التمويل",
  active:    "نشط",
  completed: "مكتمل",
};

const allStatuses = ["الكل", "جاري التمويل", "نشط", "مكتمل"];

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("الكل");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOpportunities();
    const channel = supabase
      .channel("opportunities-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "opportunities" }, () => {
        fetchOpportunities();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchOpportunities() {
    const { data } = await supabase.from("opportunities").select("*").order("created_at", { ascending: false });
    setOpportunities(data ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("opportunities").update({ status }).eq("id", id);
  }

  async function deleteOpportunity(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الفرصة؟")) return;
    await supabase.from("opportunities").delete().eq("id", id);
  }

  const filtered = opportunities.filter((o) => {
    const matchStatus = filter === "الكل" || statusLabels[o.status] === filter;
    const matchSearch = o.title.includes(search) || o.location.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{opportunities.length} فرصة إجمالاً</p>
        <Link href="/dashboard/opportunities/new" className="bg-[#2d7b33] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors flex items-center gap-2 text-sm">
          <span className="text-lg leading-none">+</span> إضافة فرصة جديدة
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن فرصة..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#2d7b33] transition-colors" />
          <svg className="absolute top-3 right-3.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <div className="flex gap-2 flex-wrap">
          {allStatuses.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === s ? "bg-[#2d7b33] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">لا توجد فرص بعد</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right text-xs text-gray-400 font-semibold px-6 py-4">الفرصة</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">النوع</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">الحالة</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">التمويل</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">العائد</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">الملاك</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((opp, i) => (
                <tr key={opp.id} className={`hover:bg-gray-50 transition-colors ${i < filtered.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#1a1a1a]">{opp.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{opp.location}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{opp.type}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1.5 rounded-full ${statusColors[opp.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {statusLabels[opp.status] ?? opp.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#2d7b33] h-1.5 rounded-full" style={{ width: `${opp.funded_percent}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{opp.funded_percent}%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{opp.total_value.toLocaleString()} ريال</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-bold text-[#2d7b33]">{opp.return_percent}%</span>
                    <p className="text-xs text-gray-400">{opp.duration_years} سنوات</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{opp.investors_count}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {opp.status === "funding" && (
                        <button onClick={() => updateStatus(opp.id, "active")} className="text-xs text-purple-600 hover:underline font-medium">تفعيل</button>
                      )}
                      {opp.status === "active" && (
                        <button onClick={() => updateStatus(opp.id, "completed")} className="text-xs text-gray-500 hover:underline font-medium">إتمام</button>
                      )}
                      <span className="text-gray-200">|</span>
                      <button onClick={() => deleteOpportunity(opp.id)} className="text-xs text-red-400 hover:underline font-medium">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
