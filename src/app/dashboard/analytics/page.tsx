"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type OppStat = { id: string; title: string; invested: number; investors_count: number; return_percent: number; total_value: number };

function fmtMoney(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return Math.round(n).toLocaleString("ar-SA");
}

export default function AnalyticsPage() {
  const [loading, setLoading]           = useState(true);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalUsers, setTotalUsers]     = useState(0);
  const [totalDist, setTotalDist]       = useState(0);
  const [avgInv, setAvgInv]             = useState(0);
  const [kycStats, setKycStats]         = useState({ complete: 0, pending: 0, rejected: 0 });
  const [oppStats, setOppStats]         = useState<OppStat[]>([]);
  const [invBuckets, setInvBuckets]     = useState({ lt10: 0, lt50: 0, lt200: 0, gt200: 0 });

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [
      { data: invData },
      { count: uCount },
      { data: distData },
      { data: kycData },
      { data: oppsData },
      { data: invAmounts },
    ] = await Promise.all([
      supabase.from("investments").select("amount, opportunity_id, opportunities(id, title, return_percent, total_value, investors_count)"),
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("distribution_logs").select("total_amount"),
      supabase.from("users").select("kyc_status"),
      supabase.from("opportunities").select("id, title, return_percent, total_value, investors_count").order("investors_count", { ascending: false }).limit(5),
      supabase.from("investments").select("amount"),
    ]);

    // Total invested
    const totalInv = (invData ?? []).reduce((s: number, r: { amount: number }) => s + (r.amount ?? 0), 0);
    setTotalInvested(totalInv);

    // Total users
    setTotalUsers(uCount ?? 0);

    // Total distributions
    setTotalDist((distData ?? []).reduce((s: number, r: { total_amount: number }) => s + (r.total_amount ?? 0), 0));

    // Average investment per investor
    const uniqueInvestors = new Set((invData ?? []).map((r: { opportunity_id: string }) => r.opportunity_id)).size;
    setAvgInv(uniqueInvestors > 0 ? totalInv / (uCount ?? 1) : 0);

    // KYC stats
    const kyc = { complete: 0, pending: 0, rejected: 0 };
    (kycData ?? []).forEach((r: { kyc_status: string }) => {
      if (r.kyc_status === "complete")  kyc.complete++;
      else if (r.kyc_status === "pending")  kyc.pending++;
      else if (r.kyc_status === "rejected") kyc.rejected++;
    });
    setKycStats(kyc);

    // Opp stats: join investments per opportunity
    const oppInvested: Record<string, number> = {};
    (invData ?? []).forEach((r: { opportunity_id: string; amount: number }) => {
      oppInvested[r.opportunity_id] = (oppInvested[r.opportunity_id] ?? 0) + (r.amount ?? 0);
    });
    type RawOpp = { id: string; title: string; return_percent: number; total_value: number; investors_count: number };
    const stats: OppStat[] = (oppsData ?? []).map((o: RawOpp) => ({
      ...o,
      invested: oppInvested[o.id] ?? 0,
    }));
    setOppStats(stats);

    // Investment amount buckets
    const amounts = (invAmounts ?? []).map((r: { amount: number }) => r.amount ?? 0);
    const buckets = { lt10: 0, lt50: 0, lt200: 0, gt200: 0 };
    amounts.forEach(a => {
      if (a < 10_000)       buckets.lt10++;
      else if (a < 50_000)  buckets.lt50++;
      else if (a < 200_000) buckets.lt200++;
      else                  buckets.gt200++;
    });
    setInvBuckets(buckets);

    setLoading(false);
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">جاري التحميل...</div>;

  const kycTotal  = kycStats.complete + kycStats.pending + kycStats.rejected || 1;
  const buckTotal = invBuckets.lt10 + invBuckets.lt50 + invBuckets.lt200 + invBuckets.gt200 || 1;
  const totalOppInvested = oppStats.reduce((s, o) => s + o.invested, 0) || 1;

  return (
    <div className="flex flex-col gap-6">

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "إجمالي الاستثمارات", value: `${fmtMoney(totalInvested)} ريال`, icon: "💰" },
          { label: "إجمالي المستثمرين",  value: totalUsers.toLocaleString("ar-SA"), icon: "👥" },
          { label: "إجمالي التوزيعات",   value: `${fmtMoney(totalDist)} ريال`, icon: "📤" },
          { label: "متوسط الاستثمار",    value: `${fmtMoney(avgInv)} ريال`, icon: "📊" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="mb-3 text-2xl">{kpi.icon}</div>
            <p className="text-xl font-extrabold text-[#1a1a1a]">{kpi.value}</p>
            <p className="text-sm text-gray-400 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Top Opportunities + KYC */}
      <div className="grid grid-cols-3 gap-4">
        {/* Top Opportunities */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-bold text-[#1a1a1a]">أداء الفرص الاستثمارية</h3>
          </div>
          {oppStats.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">لا توجد بيانات</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right text-xs text-gray-400 font-semibold px-6 py-3">الفرصة</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الاستثمارات</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">المستثمرون</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">العائد</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الحصة</th>
                </tr>
              </thead>
              <tbody>
                {oppStats.map((opp, i) => {
                  const share = Math.round((opp.invested / totalOppInvested) * 100);
                  return (
                    <tr key={opp.id} className={`hover:bg-gray-50 ${i < oppStats.length - 1 ? "border-b border-gray-50" : ""}`}>
                      <td className="px-6 py-3.5 text-sm font-semibold text-[#1a1a1a]">{opp.title}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">{fmtMoney(opp.invested)} ريال</td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">{opp.investors_count}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-[#2d7b33]">{opp.return_percent}%</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div className="bg-[#2d7b33] h-1.5 rounded-full" style={{ width: `${share}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* KYC + Investment distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <div>
            <h3 className="font-bold text-[#1a1a1a] mb-4">حالة KYC</h3>
            {[
              { label: "مكتمل",         value: kycStats.complete,  pct: Math.round(kycStats.complete / kycTotal * 100),  color: "bg-[#2d7b33]" },
              { label: "قيد المراجعة",  value: kycStats.pending,   pct: Math.round(kycStats.pending / kycTotal * 100),   color: "bg-orange-400" },
              { label: "مرفوض",         value: kycStats.rejected,  pct: Math.round(kycStats.rejected / kycTotal * 100),  color: "bg-red-400" },
            ].map((s) => (
              <div key={s.label} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">{s.label}</span>
                  <span className="font-bold text-[#1a1a1a]">{s.value.toLocaleString("ar-SA")}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className={`${s.color} h-2 rounded-full`} style={{ width: `${s.pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{s.pct}% من الإجمالي</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-50">
            <h4 className="text-sm font-bold text-[#1a1a1a] mb-3">توزيع حجم الاستثمار</h4>
            {[
              { label: "أقل من 10K",     count: invBuckets.lt10 },
              { label: "10K – 50K",       count: invBuckets.lt50 },
              { label: "50K – 200K",      count: invBuckets.lt200 },
              { label: "أكثر من 200K",    count: invBuckets.gt200 },
            ].map((r) => {
              const pct = Math.round((r.count / buckTotal) * 100);
              return (
                <div key={r.label} className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{r.label} ريال</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-[#c9a84c] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
