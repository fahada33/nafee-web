"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Opp = {
  id: string; title: string; investors_count: number;
  total_value: number; return_percent: number; funded_percent: number;
};

type DistLog = {
  id: string; opportunity_id: string; opp_title: string;
  distributed_at: string; total_amount: number; investors: number;
  actual_return: number;
};

const periodDivisor: Record<string, number> = {
  شهري: 12, "ربع سنوي": 4, "نصف سنوي": 2, سنوي: 1,
};

function fmtMoney(n: number) {
  return Math.round(n).toLocaleString("ar-SA");
}

export default function DistributionsPage() {
  const [opps, setOpps]               = useState<Opp[]>([]);
  const [logs, setLogs]               = useState<DistLog[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState<Opp | null>(null);
  const [actualReturn, setActualReturn] = useState("");
  const [schedule, setSchedule]       = useState("شهري");
  const [note, setNote]               = useState("");
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [{ data: oppsData }, { data: logsData }] = await Promise.all([
      supabase.from("opportunities").select("id, title, investors_count, total_value, return_percent, funded_percent")
        .neq("status", "completed").order("created_at", { ascending: false }),
      supabase.from("distribution_logs")
        .select("id, opportunity_id, opp_title, distributed_at, total_amount, investors, actual_return")
        .order("distributed_at", { ascending: false }).limit(20),
    ]);
    setOpps((oppsData ?? []) as Opp[]);
    setLogs((logsData ?? []) as DistLog[]);
    setLoading(false);
  }

  function openModal(opp: Opp) {
    setSelected(opp);
    setActualReturn(String(opp.return_percent));
    setSchedule("شهري");
    setNote("");
  }

  const investedAmount = selected
    ? (selected.total_value * selected.funded_percent) / 100
    : 0;
  const divisor = periodDivisor[schedule] ?? 12;
  const estimatedTotal = selected && actualReturn
    ? Math.round((investedAmount * Number(actualReturn)) / 100 / divisor)
    : 0;

  async function confirmDistribution() {
    if (!selected || !actualReturn) return;
    setSubmitting(true);
    try {
      // Fetch all active investments for this opportunity
      const { data: investments } = await supabase
        .from("investments")
        .select("user_id, amount")
        .eq("opportunity_id", selected.id)
        .eq("status", "active");

      if (!investments || investments.length === 0) {
        alert("لا يوجد ملاك في هذه الفرصة");
        setSubmitting(false);
        return;
      }

      const ret = Number(actualReturn) / 100 / divisor;

      // For each investor: create wallet_transaction + update wallet_balance
      for (const inv of investments) {
        const amount = inv.amount * ret;
        await supabase.from("wallet_transactions").insert({
          user_id: inv.user_id,
          amount,
          type: "return",
          status: "completed",
          reference: selected.id,
        });
        const { data: usr } = await supabase
          .from("users").select("wallet_balance").eq("id", inv.user_id).single();
        const current = (usr?.wallet_balance as number) ?? 0;
        await supabase.from("users")
          .update({ wallet_balance: current + amount })
          .eq("id", inv.user_id);
      }

      // Log the distribution
      await supabase.from("distribution_logs").insert({
        opportunity_id: selected.id,
        opp_title: selected.title,
        total_amount: estimatedTotal,
        investors: investments.length,
        actual_return: Number(actualReturn),
        note: note || null,
      });

      await fetchAll();
      setSelected(null);
    } catch (e) {
      alert("حدث خطأ، يرجى المحاولة مجدداً");
    }
    setSubmitting(false);
  }

  // Stats
  const thisMonth = logs.filter(l => {
    const d = new Date(l.distributed_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonth.reduce((s, l) => s + l.total_amount, 0);
  const thisMonthInvestors = new Set(thisMonth.map(l => l.opportunity_id)).size;

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">جاري التحميل...</div>;

  return (
    <div className="flex flex-col gap-6">

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "التوزيعات هذا الشهر", value: `${fmtMoney(thisMonthTotal)} ريال`, icon: "💸", color: "text-[#2d7b33]" },
          { label: "فرص وزّعت هذا الشهر", value: `${thisMonthInvestors}`, icon: "🏢", color: "text-blue-600" },
          { label: "إجمالي التوزيعات",     value: `${fmtMoney(logs.reduce((s, l) => s + l.total_amount, 0))} ريال`, icon: "📊", color: "text-purple-600" },
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

      {/* Active Opportunities */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-[#1a1a1a]">الفرص النشطة</h3>
          <p className="text-xs text-gray-400 mt-0.5">اختر فرصة لصرف التوزيعات على ملاكها</p>
        </div>
        {opps.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">لا توجد فرص نشطة</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right text-xs text-gray-400 font-semibold px-6 py-3">الفرصة</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">مبلغ التملك</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الملاك</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الدخل الإيجاري المتوقع</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {opps.map((opp, i) => {
                const invested = (opp.total_value * opp.funded_percent) / 100;
                return (
                  <tr key={opp.id} className={`hover:bg-gray-50 transition-colors ${i < opps.length - 1 ? "border-b border-gray-50" : ""}`}>
                    <td className="px-6 py-4 text-sm font-bold text-[#1a1a1a]">{opp.title}</td>
                    <td className="px-4 py-4 text-sm text-gray-700 font-medium">{fmtMoney(invested)} ريال</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{opp.investors_count}</td>
                    <td className="px-4 py-4 text-sm font-bold text-[#2d7b33]">
                      {fmtMoney((invested * opp.return_percent) / 100 / 12)} ريال/شهر
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => openModal(opp)}
                        className="bg-[#2d7b33] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#1f5a24] transition-colors whitespace-nowrap">
                        صرف توزيع
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Distribution History */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-[#1a1a1a]">سجل التوزيعات</h3>
        </div>
        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">لا توجد توزيعات بعد</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right text-xs text-gray-400 font-semibold px-6 py-3">الفرصة</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">تاريخ التوزيع</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">إجمالي المبلغ</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الملاك</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الدخل الفعلي</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={l.id} className={`hover:bg-gray-50 ${i < logs.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <td className="px-6 py-4 text-sm font-semibold text-[#1a1a1a]">{l.opp_title}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(l.distributed_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-[#2d7b33]">{fmtMoney(l.total_amount)} ريال</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{l.investors}</td>
                  <td className="px-4 py-4 text-sm font-bold text-gray-700">{l.actual_return}%</td>
                  <td className="px-4 py-4">
                    <span className="bg-[#e8f5e9] text-[#2d7b33] text-xs font-medium px-2.5 py-1 rounded-full">مكتملة</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-[#1a1a1a] text-lg">صرف توزيع — {selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-xl">✕</button>
            </div>

            <div className="bg-[#e8f5e9] rounded-2xl p-4 mb-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">مبلغ التملك: </span><span className="font-bold">{fmtMoney(investedAmount)} ريال</span></div>
                <div><span className="text-gray-500">الملاك: </span><span className="font-bold">{selected.investors_count}</span></div>
                <div><span className="text-gray-500">الدخل الافتراضي: </span><span className="font-bold text-[#2d7b33]">{selected.return_percent}%</span></div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">الدخل الفعلي (%) *</label>
                  <div className="relative">
                    <input type="number" value={actualReturn} onChange={(e) => setActualReturn(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-8 text-lg font-bold focus:outline-none focus:border-[#2d7b33]"
                      step="0.1" />
                    <span className="absolute left-3 top-3.5 text-gray-400">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">دورية التوزيع</label>
                  <select value={schedule} onChange={(e) => setSchedule(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#2d7b33] bg-white text-sm">
                    {Object.keys(periodDivisor).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {actualReturn && (
                <div className="bg-[#e8f5e9] rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">إجمالي التوزيع الذي سيُصرف</p>
                  <p className="text-2xl font-extrabold text-[#2d7b33]">{fmtMoney(estimatedTotal)} ريال</p>
                  <p className="text-xs text-gray-400 mt-1">يوزع على {selected.investors_count} مالك</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">ملاحظات (اختياري)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="أي ملاحظات للملاك..."
                  rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d7b33] resize-none" />
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setSelected(null)}
                  className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
                <button onClick={confirmDistribution} disabled={submitting || !actualReturn}
                  className="flex-1 bg-[#2d7b33] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#1f5a24] transition-colors disabled:opacity-50">
                  {submitting ? "جاري الصرف..." : "تأكيد وصرف التوزيع"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
