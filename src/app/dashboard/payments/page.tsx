"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Tx = {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  status: string;
  reference: string;
  created_at: string;
};

type UserInfo = { id: string; phone: string; full_name: string | null };

export default function PaymentsPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [users, setUsers] = useState<Record<string, UserInfo>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    const { data } = await supabase
      .from("wallet_transactions")
      .select("*")
      .like("reference", "moyasar:%")
      .order("created_at", { ascending: false })
      .limit(500);
    const rows = (data ?? []) as Tx[];
    setTxs(rows);

    const userIds = [...new Set(rows.map((t) => t.user_id))];
    if (userIds.length > 0) {
      const { data: usersData } = await supabase
        .from("users")
        .select("id, phone, full_name")
        .in("id", userIds);
      const map: Record<string, UserInfo> = {};
      (usersData ?? []).forEach((u) => {
        map[u.id as string] = u as UserInfo;
      });
      setUsers(map);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    const channel = supabase
      .channel("wallet-tx-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallet_transactions" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return txs;
    const q = search.trim().toLowerCase();
    return txs.filter((t) => {
      const u = users[t.user_id];
      return (
        t.reference.toLowerCase().includes(q) ||
        (u?.phone ?? "").toLowerCase().includes(q) ||
        (u?.full_name ?? "").toLowerCase().includes(q)
      );
    });
  }, [txs, search, users]);

  const total = filtered.reduce((s, t) => s + Number(t.amount || 0), 0);

  function fmtMoney(n: number) {
    return n.toLocaleString("ar-SA");
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <span className="text-3xl">💳</span>
          <div>
            <p className="text-xl font-extrabold text-[#2d7b33]">{filtered.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">إجمالي معاملات البطاقة</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <span className="text-3xl">💰</span>
          <div>
            <p className="text-xl font-extrabold text-[#2d7b33]">{fmtMoney(Math.round(total))} ريال</p>
            <p className="text-sm text-gray-400 mt-0.5">إجمالي المبالغ المحصّلة</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <span className="text-3xl">✅</span>
          <div>
            <p className="text-xl font-extrabold text-green-600">تلقائي</p>
            <p className="text-sm text-gray-400 mt-0.5">كل معاملات Moyasar تُعتمد تلقائياً</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="ابحث بالجوال، الاسم، أو رقم العملية..."
        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d7b33]"
      />

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-[#1a1a1a]">سجل معاملات البطاقة</h3>
          <p className="text-xs text-gray-400 mt-0.5">كل المعاملات تمت عبر Moyasar وتم التحقق منها سيرفر-لـ-سيرفر</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-gray-400">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">لا توجد معاملات بعد</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right text-xs text-gray-400 font-semibold px-6 py-3">المستخدم</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">المبلغ</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">Moyasar ID</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">التاريخ</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const u = users[t.user_id];
                const moyasarId = t.reference.replace(/^moyasar:/, "");
                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-gray-50 ${i < filtered.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-bold text-[#1a1a1a]">
                        {u?.full_name || "—"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{u?.phone ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-[#2d7b33]">
                      {fmtMoney(Number(t.amount))} ريال
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 font-mono">
                      {moyasarId.slice(0, 8)}…{moyasarId.slice(-4)}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">{fmtDate(t.created_at)}</td>
                    <td className="px-4 py-3.5">
                      <span className="bg-[#e8f5e9] text-[#2d7b33] text-xs font-medium px-2.5 py-1 rounded-full">
                        {t.status === "completed" ? "مكتمل" : t.status}
                      </span>
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
