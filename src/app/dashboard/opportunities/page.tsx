"use client";

import { useState } from "react";
import Link from "next/link";

const opportunities = [
  { id: "1", title: "برج الأعمال", location: "الرياض، حي العليا", type: "مكاتب تجارية", status: "تمويل مفتوح", funded: 68, target: 2000000, investors: 142, return: "12%", duration: "3 سنوات", minInvest: 5000, created: "1 مارس 2025" },
  { id: "2", title: "مجمع الواحة", location: "جدة، حي الزهراء", type: "تجزئة", status: "تمويل مفتوح", funded: 45, target: 1500000, investors: 87, return: "10%", duration: "2 سنة", minInvest: 3000, created: "15 فبراير 2025" },
  { id: "3", title: "فيلا بريميوم", location: "الدمام، حي الشاطئ", type: "سكني", status: "مكتمل التمويل", funded: 100, target: 800000, investors: 64, return: "9%", duration: "5 سنوات", minInvest: 10000, created: "1 يناير 2025" },
  { id: "4", title: "مركز لوجستي", location: "الرياض، المنطقة الصناعية", type: "مستودعات", status: "تمويل مفتوح", funded: 22, target: 3000000, investors: 38, return: "14%", duration: "4 سنوات", minInvest: 8000, created: "10 أبريل 2025" },
  { id: "5", title: "مول التجمع", location: "المدينة المنورة", type: "تجزئة", status: "مسودة", funded: 0, target: 2500000, investors: 0, return: "11%", duration: "3 سنوات", minInvest: 5000, created: "15 أبريل 2025" },
];

const statusColors: Record<string, string> = {
  "مسودة":          "bg-gray-100 text-gray-500",       // DRAFT
  "تمويل مفتوح":   "bg-[#e8f5e9] text-[#2d7b33]",    // FUNDING
  "مكتمل التمويل": "bg-blue-50 text-blue-600",         // FUNDED
  "نشط":            "bg-purple-50 text-purple-600",    // ACTIVE
  "مكتمل":          "bg-gray-100 text-gray-500",       // COMPLETED
  "ملغي":           "bg-red-50 text-red-500",          // CANCELLED
};

const allStatuses = ["الكل", "مسودة", "تمويل مفتوح", "مكتمل التمويل", "نشط", "مكتمل", "ملغي"];

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState("الكل");
  const [search, setSearch] = useState("");

  const filtered = opportunities.filter((o) => {
    const matchStatus = filter === "الكل" || o.status === filter;
    const matchSearch = o.title.includes(search) || o.location.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{opportunities.length} فرصة إجمالاً</p>
        <Link
          href="/dashboard/opportunities/new"
          className="bg-[#2d7b33] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors flex items-center gap-2 text-sm"
        >
          <span className="text-lg leading-none">+</span> إضافة فرصة جديدة
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن فرصة..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#2d7b33] transition-colors"
          />
          <svg className="absolute top-3 right-3.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <div className="flex gap-2 flex-wrap">
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === s ? "bg-[#2d7b33] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-500">{opp.type}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1.5 rounded-full ${statusColors[opp.status]}`}>
                    {opp.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-[#2d7b33] h-1.5 rounded-full" style={{ width: `${opp.funded}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{opp.funded}%</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{(opp.target * opp.funded / 100).toLocaleString()} / {opp.target.toLocaleString()} ريال</p>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-bold text-[#2d7b33]">{opp.return}</span>
                  <p className="text-xs text-gray-400">{opp.duration}</p>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">{opp.investors}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-blue-600 hover:underline font-medium">تعديل</button>
                    <span className="text-gray-200">|</span>
                    {opp.status === "مسودة" && (
                      <button className="text-xs text-[#2d7b33] hover:underline font-medium">نشر</button>
                    )}
                    {opp.status === "تمويل مفتوح" && (
                      <button className="text-xs text-orange-500 hover:underline font-medium">إغلاق</button>
                    )}
                    {opp.status === "مكتمل التمويل" && (
                      <button className="text-xs text-purple-600 hover:underline font-medium">تفعيل</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
