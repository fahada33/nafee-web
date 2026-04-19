"use client";

import { useState } from "react";

const opportunities = [
  { id: "1", title: "برج الأعمال", investors: 142, totalInvested: 1360000, distribution: "شهري", nextDate: "15 مايو 2025", return: 12 },
  { id: "2", title: "مجمع الواحة", investors: 87, totalInvested: 675000, distribution: "ربع سنوي", nextDate: "1 يوليو 2025", return: 10 },
  { id: "3", title: "فيلا بريميوم", investors: 64, totalInvested: 800000, distribution: "نصف سنوي", nextDate: "1 أكتوبر 2025", return: 9 },
  { id: "4", title: "مركز لوجستي", investors: 38, totalInvested: 660000, distribution: "ربع سنوي", nextDate: "1 يوليو 2025", return: 14 },
];

const history = [
  { id: "1", opportunity: "برج الأعمال", date: "15 أبريل 2025", totalAmount: 13600, investors: 142, status: "مكتملة" },
  { id: "2", opportunity: "مجمع الواحة", date: "1 أبريل 2025", totalAmount: 16875, investors: 87, status: "مكتملة" },
  { id: "3", opportunity: "فيلا بريميوم", date: "1 أبريل 2025", totalAmount: 36000, investors: 64, status: "مكتملة" },
  { id: "4", opportunity: "برج الأعمال", date: "15 مارس 2025", totalAmount: 13600, investors: 142, status: "مكتملة" },
];

export default function DistributionsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<typeof opportunities[0] | null>(null);
  const [actualReturn, setActualReturn] = useState("");
  const [note, setNote] = useState("");

  const openModal = (opp: typeof opportunities[0]) => {
    setSelected(opp);
    setActualReturn(String(opp.return));
    setShowModal(true);
  };

  const estimatedTotal = selected
    ? Math.round((selected.totalInvested * Number(actualReturn)) / 100 / (selected.distribution === "شهري" ? 12 : selected.distribution === "ربع سنوي" ? 4 : selected.distribution === "نصف سنوي" ? 2 : 1))
    : 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "التوزيعات هذا الشهر", value: "340,000 ريال", icon: "💸", color: "text-[#2d7b33]" },
          { label: "الملاك المستفيدون", value: "331 مستثمر", icon: "👥", color: "text-blue-600" },
          { label: "التوزيع القادم", value: "15 مايو 2025", icon: "📅", color: "text-orange-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Distributions */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-[#1a1a1a]">التوزيعات القادمة</h3>
          <p className="text-xs text-gray-400 mt-0.5">أدخل العوائد الفعلية لكل فرصة</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-right text-xs text-gray-400 font-semibold px-6 py-3">الفرصة</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">التوزيع</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">إجمالي قيمة الوحدات</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الملاك</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الموعد القادم</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">العائد المتوقع</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opp, i) => (
              <tr key={opp.id} className={`hover:bg-gray-50 transition-colors ${i < opportunities.length - 1 ? "border-b border-gray-50" : ""}`}>
                <td className="px-6 py-4 text-sm font-bold text-[#1a1a1a]">{opp.title}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{opp.distribution}</td>
                <td className="px-4 py-4 text-sm text-gray-700 font-medium">{opp.totalInvested.toLocaleString()} ريال</td>
                <td className="px-4 py-4 text-sm text-gray-500">{opp.investors}</td>
                <td className="px-4 py-4 text-sm text-orange-500 font-medium">{opp.nextDate}</td>
                <td className="px-4 py-4 text-sm font-bold text-[#2d7b33]">
                  {Math.round((opp.totalInvested * opp.return) / 100 / (opp.distribution === "شهري" ? 12 : opp.distribution === "ربع سنوي" ? 4 : opp.distribution === "نصف سنوي" ? 2 : 1)).toLocaleString()} ريال
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => openModal(opp)}
                    className="bg-[#2d7b33] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#1f5a24] transition-colors whitespace-nowrap"
                  >
                    إدخال التوزيع
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-[#1a1a1a]">سجل التوزيعات السابقة</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-right text-xs text-gray-400 font-semibold px-6 py-3">الفرصة</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">تاريخ التوزيع</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">إجمالي التوزيع</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الملاك</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={h.id + h.date} className={`hover:bg-gray-50 ${i < history.length - 1 ? "border-b border-gray-50" : ""}`}>
                <td className="px-6 py-4 text-sm font-semibold text-[#1a1a1a]">{h.opportunity}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{h.date}</td>
                <td className="px-4 py-4 text-sm font-bold text-[#2d7b33]">{h.totalAmount.toLocaleString()} ريال</td>
                <td className="px-4 py-4 text-sm text-gray-500">{h.investors}</td>
                <td className="px-4 py-4">
                  <span className="bg-[#e8f5e9] text-[#2d7b33] text-xs font-medium px-2.5 py-1 rounded-full">{h.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-[#1a1a1a] text-lg">إدخال توزيع - {selected.title}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-gray-500 text-xl">✕</button>
            </div>

            <div className="bg-[#e8f5e9] rounded-2xl p-4 mb-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">إجمالي قيمة الوحدات:</span> <span className="font-bold">{selected.totalInvested.toLocaleString()} ريال</span></div>
                <div><span className="text-gray-500">الملاك:</span> <span className="font-bold">{selected.investors}</span></div>
                <div><span className="text-gray-500">التوزيع:</span> <span className="font-bold">{selected.distribution}</span></div>
                <div><span className="text-gray-500">العائد الافتراضي:</span> <span className="font-bold text-[#2d7b33]">{selected.return}%</span></div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">العائد الفعلي (%) *</label>
                <div className="relative">
                  <input
                    type="number"
                    value={actualReturn}
                    onChange={(e) => setActualReturn(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 text-lg font-bold focus:outline-none focus:border-[#2d7b33] transition-colors"
                    step="0.1"
                  />
                  <span className="absolute left-3 top-3.5 text-gray-400">%</span>
                </div>
              </div>

              {actualReturn && (
                <div className="bg-[#e8f5e9] rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">إجمالي التوزيع الذي سيُصرف</p>
                  <p className="text-2xl font-extrabold text-[#2d7b33]">{estimatedTotal.toLocaleString()} ريال</p>
                  <p className="text-xs text-gray-400 mt-1">يوزع على {selected.investors} مالك</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">ملاحظات (اختياري)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="أي ملاحظات للمستثمرين..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d7b33] transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-[#2d7b33] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#1f5a24] transition-colors"
                >
                  تأكيد وصرف التوزيع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
