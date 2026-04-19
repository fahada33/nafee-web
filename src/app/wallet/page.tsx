"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import AppShell from "@/components/AppShell";

const transactions = [
  { id: 1, type: "توزيع", desc: "توزيع شهري - برج الأعمال", amount: "+1,200", date: "15 أبريل 2025", positive: true },
  { id: 2, type: "توزيع", desc: "توزيع شهري - مجمع الواحة", amount: "+850", date: "15 أبريل 2025", positive: true },
  { id: 3, type: "استثمار", desc: "استثمار - مركز لوجستي", amount: "-8,000", date: "10 أبريل 2025", positive: false },
  { id: 4, type: "شحن", desc: "شحن المحفظة - مدى", amount: "+10,000", date: "5 أبريل 2025", positive: true },
  { id: 5, type: "توزيع", desc: "توزيع ربع سنوي - فيلا بريميوم", amount: "+2,250", date: "1 أبريل 2025", positive: true },
  { id: 6, type: "سحب", desc: "سحب إلى الحساب البنكي", amount: "-5,000", date: "28 مارس 2025", positive: false },
  { id: 7, type: "استثمار", desc: "استثمار - مجمع الواحة", amount: "-3,000", date: "20 مارس 2025", positive: false },
];

const filters = ["الكل", "توزيع", "استثمار", "شحن", "سحب"];

const typeConfig: Record<string, { color: string; bg: string; icon: string }> = {
  "توزيع": { color: "text-[#2d7b33]", bg: "bg-[#e8f5e9]", icon: "↑" },
  "استثمار": { color: "text-blue-600", bg: "bg-blue-50", icon: "→" },
  "شحن": { color: "text-purple-600", bg: "bg-purple-50", icon: "+" },
  "سحب": { color: "text-orange-600", bg: "bg-orange-50", icon: "↓" },
};

export default function WalletPage() {
  const [filter, setFilter] = useState("الكل");
  const [activeModal, setActiveModal] = useState<"topup" | "withdraw" | null>(null);
  const [modalAmount, setModalAmount] = useState("");

  const filtered = transactions.filter((t) => filter === "الكل" || t.type === filter);

  return (
    <AppShell>
      <div className="min-h-screen bg-[#f5f5f5] pb-24">
        <TopBar title="المحفظة" />

        {/* Balance Card */}
        <div className="bg-[#2d7b33] mx-4 mt-4 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -right-4 w-40 h-40 rounded-full bg-white/5" />
          <div className="relative z-10">
            <p className="text-sm opacity-70 mb-1">الرصيد المتاح</p>
            <h2 className="text-4xl font-extrabold">42,500</h2>
            <p className="text-sm opacity-60 mb-5">ريال سعودي</p>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveModal("topup")}
                className="flex-1 bg-white text-[#2d7b33] text-sm font-bold py-3 rounded-xl hover:bg-[#e8f5e9] transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="text-lg leading-none">+</span> شحن المحفظة
              </button>
              <button
                onClick={() => setActiveModal("withdraw")}
                className="flex-1 bg-white/15 text-white text-sm font-bold py-3 rounded-xl hover:bg-white/25 transition-colors"
              >
                سحب
              </button>
            </div>
          </div>
        </div>

        {/* Top Up Modal */}
        {activeModal === "topup" && (
          <div className="bg-white mx-4 mt-3 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1a1a1a]">شحن المحفظة</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="relative mb-4">
              <input
                type="number"
                value={modalAmount}
                onChange={(e) => setModalAmount(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right text-2xl font-bold focus:outline-none focus:border-[#2d7b33] transition-colors"
              />
              <span className="absolute left-4 top-3.5 text-gray-400 text-sm">ريال</span>
            </div>
            <div className="flex gap-2 mb-4">
              {["500", "1,000", "5,000", "10,000"].map((v) => (
                <button key={v} onClick={() => setModalAmount(v.replace(",", ""))} className="flex-1 bg-[#e8f5e9] text-[#2d7b33] text-xs font-medium py-2 rounded-lg">
                  {v}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-3 font-medium">طريقة الدفع</p>
            <div className="flex flex-col gap-2 mb-4">
              {[
                { label: "مدى", desc: "بطاقة مدى" },
                { label: "فيزا / ماستركارد", desc: "بطاقة ائتمانية" },
                { label: "تحويل بنكي", desc: "IBAN" },
              ].map((m) => (
                <button key={m.label} className="flex items-center justify-between border border-gray-100 rounded-xl py-3.5 px-4 hover:border-[#2d7b33] hover:bg-[#e8f5e9] transition-colors">
                  <span className="text-sm font-medium text-[#1a1a1a]">{m.label}</span>
                  <span className="text-xs text-gray-400">{m.desc}</span>
                </button>
              ))}
            </div>
            <button className="w-full bg-[#2d7b33] text-white font-bold py-4 rounded-xl hover:bg-[#1f5a24] transition-colors">
              متابعة الدفع
            </button>
          </div>
        )}

        {/* Withdraw Modal */}
        {activeModal === "withdraw" && (
          <div className="bg-white mx-4 mt-3 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1a1a1a]">سحب من المحفظة</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="relative mb-4">
              <input
                type="number"
                value={modalAmount}
                onChange={(e) => setModalAmount(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right text-2xl font-bold focus:outline-none focus:border-[#2d7b33] transition-colors"
              />
              <span className="absolute left-4 top-3.5 text-gray-400 text-sm">ريال</span>
            </div>
            <div className="bg-[#e8f5e9] rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-500 text-center">سيتم التحويل لحسابك البنكي المسجل خلال 1-3 أيام عمل</p>
            </div>
            <button className="w-full bg-[#2d7b33] text-white font-bold py-4 rounded-xl hover:bg-[#1f5a24] transition-colors">
              تأكيد السحب
            </button>
          </div>
        )}

        {/* Transactions */}
        <div className="mx-4 mt-5">
          <h3 className="font-bold text-[#1a1a1a] mb-3">سجل المعاملات</h3>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? "bg-[#2d7b33] text-white" : "bg-white text-gray-500 border border-gray-100"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {filtered.map((tx, i) => {
              const config = typeConfig[tx.type];
              return (
                <div key={tx.id} className={`flex items-center justify-between px-4 py-4 ${i < filtered.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${config.bg} ${config.color}`}>
                      {config.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a] leading-tight">{tx.desc}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm whitespace-nowrap ${tx.positive ? "text-[#2d7b33]" : "text-red-500"}`}>
                    {tx.amount} ر
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
