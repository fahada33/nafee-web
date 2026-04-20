"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Opp = { id: string; title: string; status: string; funded_percent: number; total_value: number; investors_count: number };
type User = { phone: string; full_name: string | null; national_id: string; kyc_status: string; created_at: string };

const statusLabel: Record<string, string> = {
  funding:   "تمويل مفتوح",
  active:    "نشط",
  completed: "مكتمل",
  draft:     "مسودة",
};
const statusColor: Record<string, string> = {
  funding:   "bg-[#e8f5e9] text-[#2d7b33]",
  active:    "bg-purple-50 text-purple-600",
  completed: "bg-gray-100 text-gray-500",
  draft:     "bg-gray-100 text-gray-500",
};
const kycLabel: Record<string, string>  = { pending: "قيد المراجعة", complete: "مكتمل", rejected: "مرفوض" };
const kycColor: Record<string, string>  = {
  pending:  "bg-orange-50 text-orange-500",
  complete: "bg-[#e8f5e9] text-[#2d7b33]",
  rejected: "bg-red-50 text-red-500",
};

function fmtMoney(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString("ar-SA");
}

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "اليوم";
  if (days === 1) return "أمس";
  return `منذ ${days} أيام`;
}

export default function DashboardPage() {
  const [loading, setLoading]           = useState(true);
  const [usersCount, setUsersCount]     = useState(0);
  const [pendingKyc, setPendingKyc]     = useState(0);
  const [pendingDeposits, setPendingDeposits] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [opportunities, setOpportunities] = useState<Opp[]>([]);
  const [recentUsers, setRecentUsers]   = useState<User[]>([]);
  const [activeOpps, setActiveOpps]     = useState(0);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [
      { count: uCount },
      { count: kycCount },
      { count: depCount },
      { data: invData },
      { data: oppsData },
      { data: usersData },
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }).eq("kyc_status", "pending"),
      supabase.from("wallet_transactions").select("*", { count: "exact", head: true }).eq("type", "deposit").eq("status", "pending"),
      supabase.from("investments").select("amount"),
      supabase.from("opportunities").select("id, title, status, funded_percent, total_value, investors_count").order("created_at", { ascending: false }).limit(5),
      supabase.from("users").select("phone, full_name, national_id, kyc_status, created_at").order("created_at", { ascending: false }).limit(5),
    ]);

    const total = (invData ?? []).reduce((s: number, r: { amount: number }) => s + (r.amount ?? 0), 0);
    const opps  = (oppsData ?? []) as Opp[];

    setUsersCount(uCount ?? 0);
    setPendingKyc(kycCount ?? 0);
    setPendingDeposits(depCount ?? 0);
    setTotalInvested(total);
    setOpportunities(opps);
    setActiveOpps(opps.filter(o => o.status !== "completed").length);
    setRecentUsers((usersData ?? []) as User[]);
    setLoading(false);
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">جاري التحميل...</div>;

  return (
    <div className="flex flex-col gap-6">

      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1a1a]">مرحباً، ماجد 👋</h2>
          <p className="text-gray-400 text-sm mt-1">إليك ملخص المنصة اليوم</p>
        </div>
        <Link
          href="/dashboard/opportunities/new"
          className="bg-[#2d7b33] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors flex items-center gap-2 text-sm"
        >
          <span className="text-lg leading-none">+</span> فرصة جديدة
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "إجمالي الملاك",          value: usersCount.toLocaleString("ar-SA"), icon: "👥",  color: "text-[#1a1a1a]" },
          { label: "الفرص النشطة",            value: String(activeOpps),                 icon: "🏢",  color: "text-[#1a1a1a]" },
          { label: "إجمالي الاستثمارات",      value: fmtMoney(totalInvested),            icon: "💰",  color: "text-[#2d7b33]", unit: "ريال" },
          { label: "طلبات شحن معلقة",         value: String(pendingDeposits),            icon: "📥",  color: "text-orange-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="mb-3 text-2xl">{stat.icon}</div>
            <p className={`text-2xl font-extrabold ${stat.color}`}>
              {stat.value} <span className="text-sm font-medium text-gray-400">{stat.unit ?? ""}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Opportunities Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-[#1a1a1a]">الفرص الاستثمارية</h3>
          <Link href="/dashboard/opportunities" className="text-[#2d7b33] text-sm font-medium hover:underline">عرض الكل</Link>
        </div>
        {opportunities.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">لا توجد فرص بعد</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-right text-xs text-gray-400 font-semibold px-6 py-3">الفرصة</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الحالة</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">التمويل</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">القيمة الكلية</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الملاك</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp, i) => (
                <tr key={opp.id} className={`hover:bg-gray-50 transition-colors ${i < opportunities.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <td className="px-6 py-4 text-sm font-semibold text-[#1a1a1a]">{opp.title}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[opp.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {statusLabel[opp.status] ?? opp.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#2d7b33] h-1.5 rounded-full" style={{ width: `${opp.funded_percent}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{opp.funded_percent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{fmtMoney(opp.total_value)} ريال</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{opp.investors_count} مالك</td>
                  <td className="px-4 py-4">
                    <Link href="/dashboard/opportunities" className="text-[#2d7b33] text-xs font-medium hover:underline">إدارة</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Users + Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {/* Users Table */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h3 className="font-bold text-[#1a1a1a]">آخر المستخدمين</h3>
            <Link href="/dashboard/users" className="text-[#2d7b33] text-sm font-medium hover:underline">عرض الكل</Link>
          </div>
          {recentUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">لا يوجد مستخدمون</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-right text-xs text-gray-400 font-semibold px-6 py-3">المستخدم</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">حالة KYC</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">تاريخ الانضمام</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, i) => {
                  const display = user.full_name || user.national_id || user.phone;
                  return (
                    <tr key={user.phone} className={`hover:bg-gray-50 transition-colors ${i < recentUsers.length - 1 ? "border-b border-gray-50" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-[#2d7b33]">{display[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1a1a1a]">{display}</p>
                            <p className="text-xs text-gray-400">{user.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${kycColor[user.kyc_status] ?? "bg-gray-100 text-gray-500"}`}>
                          {kycLabel[user.kyc_status] ?? user.kyc_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">{relativeDate(user.created_at)}</td>
                      <td className="px-4 py-4">
                        <Link href="/dashboard/users" className="text-[#2d7b33] text-xs font-medium hover:underline">عرض</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-[#1a1a1a]">إحصائيات سريعة</h3>
          {[
            { label: "طلبات KYC معلقة",   value: pendingKyc,      color: "text-orange-500", href: "/dashboard/users" },
            { label: "طلبات شحن معلقة",   value: pendingDeposits, color: "text-blue-500",   href: "/dashboard/wallet" },
            { label: "الفرص النشطة",       value: activeOpps,      color: "text-[#2d7b33]",  href: "/dashboard/opportunities" },
            { label: "إجمالي الملاك",      value: usersCount,      color: "text-purple-500", href: "/dashboard/users" },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:opacity-70 transition-opacity">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className={`font-extrabold text-lg ${item.color}`}>{item.value}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
