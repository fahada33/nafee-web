"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type UserRef = { phone: string; national_id: string; full_name: string | null; wallet_balance: number };

type DepositRequest = {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  users: UserRef | UserRef[] | null;
};

function getUser(req: DepositRequest): UserRef | null {
  if (!req.users) return null;
  return Array.isArray(req.users) ? req.users[0] ?? null : req.users;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fmtMoney(n: number) {
  return n.toLocaleString("ar-SA");
}

export default function WalletPage() {
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "completed" | "all">("pending");

  useEffect(() => {
    fetchRequests();
    const channel = supabase
      .channel("wallet-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "wallet_transactions" }, fetchRequests)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchRequests() {
    const { data } = await supabase
      .from("wallet_transactions")
      .select("id, amount, status, created_at, users(phone, national_id, full_name, wallet_balance)")
      .eq("type", "deposit")
      .order("created_at", { ascending: false });
    setRequests((data ?? []) as unknown as DepositRequest[]);
    setLoading(false);
  }

  async function approveDeposit(req: DepositRequest) {
    const user = getUser(req);
    if (!user) return;

    await supabase.from("wallet_transactions").update({ status: "completed" }).eq("id", req.id);

    const newBalance = (user.wallet_balance ?? 0) + req.amount;
    await supabase.from("users").update({ wallet_balance: newBalance }).eq("phone", user.phone);
  }

  async function rejectDeposit(id: string) {
    await supabase.from("wallet_transactions").update({ status: "failed" }).eq("id", id);
  }

  const filtered = requests.filter(r =>
    filter === "all" ? true : r.status === filter
  );

  const pendingCount  = requests.filter(r => r.status === "pending").length;
  const pendingAmount = requests.filter(r => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const totalApproved = requests.filter(r => r.status === "completed").reduce((s, r) => s + r.amount, 0);

  const statusColor: Record<string, string> = {
    pending:   "bg-orange-50 text-orange-500",
    completed: "bg-[#e8f5e9] text-[#2d7b33]",
    failed:    "bg-red-50 text-red-500",
  };
  const statusLabel: Record<string, string> = {
    pending:   "قيد المراجعة",
    completed: "مُعتمد",
    failed:    "مرفوض",
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-orange-500">{pendingCount}</p>
          <p className="text-xs text-gray-400 mt-1">طلبات معلقة</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-orange-500">{fmtMoney(pendingAmount)}</p>
          <p className="text-xs text-gray-400 mt-1">مبلغ معلق (ريال)</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-[#2d7b33]">{fmtMoney(totalApproved)}</p>
          <p className="text-xs text-gray-400 mt-1">إجمالي الشحن المُعتمد (ريال)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-2">
        {(["pending", "completed", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? "bg-[#2d7b33] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
            {f === "pending" ? "معلقة" : f === "completed" ? "مُعتمدة" : "الكل"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">لا توجد طلبات</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right text-xs text-gray-400 font-semibold px-6 py-4">المستخدم</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">المبلغ</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">رصيد الحساب</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">الحالة</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">التاريخ</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((req, i) => {
                const user = getUser(req);
                return (
                  <tr key={req.id} className={`transition-colors ${i < filtered.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-[#2d7b33]">{(user?.full_name || user?.national_id || "?")[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1a1a1a]">{user?.full_name || user?.national_id}</p>
                          <p className="text-xs text-gray-400">{user?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-[#2d7b33]">{fmtMoney(req.amount)} ريال</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{fmtMoney(user?.wallet_balance ?? 0)} ريال</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[req.status] ?? "bg-gray-100 text-gray-400"}`}>
                        {statusLabel[req.status] ?? req.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400">{formatDate(req.created_at)}</td>
                    <td className="px-4 py-4">
                      {req.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => approveDeposit(req)}
                            className="bg-[#2d7b33] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#1f5a24] transition-colors">
                            قبول
                          </button>
                          <button onClick={() => rejectDeposit(req.id)}
                            className="bg-red-50 text-red-500 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                            رفض
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
