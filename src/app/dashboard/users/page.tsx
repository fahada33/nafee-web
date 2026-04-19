"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  national_id: string;
  phone: string;
  kyc_status: string;
  status: string;
  created_at: string;
};

const kycMap: Record<string, string> = {
  pending: "قيد المراجعة",
  complete: "مكتمل",
  rejected: "مرفوض",
};

const statusMap: Record<string, string> = {
  active: "نشط",
  pending: "معلق",
  suspended: "موقوف",
};

const kycColors: Record<string, string> = {
  complete: "bg-[#e8f5e9] text-[#2d7b33]",
  pending: "bg-orange-50 text-orange-500",
  rejected: "bg-red-50 text-red-500",
};

const statusColors: Record<string, string> = {
  active: "bg-[#e8f5e9] text-[#2d7b33]",
  pending: "bg-orange-50 text-orange-500",
  suspended: "bg-red-50 text-red-500",
};

const kycFilters = ["الكل", "مكتمل", "قيد المراجعة", "مرفوض"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("الكل");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel("users-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchUsers() {
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data ?? []);
    setLoading(false);
  }

  async function updateKyc(id: string, kyc_status: string) {
    await supabase.from("users").update({ kyc_status }).eq("id", id);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("users").update({ status }).eq("id", id);
  }

  const filtered = users.filter((u) => {
    const matchSearch = u.phone.includes(search) || u.national_id.includes(search);
    const matchKyc = kycFilter === "الكل" || kycMap[u.kyc_status] === kycFilter;
    return matchSearch && matchKyc;
  });

  const selectedUser = users.find((u) => u.id === selected);

  return (
    <div className="flex gap-5">
      <div className="flex-1 flex flex-col gap-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "إجمالي المستخدمين", value: users.length, color: "text-[#1a1a1a]" },
            { label: "هوية مكتملة", value: users.filter(u => u.kyc_status === "complete").length, color: "text-[#2d7b33]" },
            { label: "قيد المراجعة", value: users.filter(u => u.kyc_status === "pending").length, color: "text-orange-500" },
            { label: "موقوف", value: users.filter(u => u.status === "suspended").length, color: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث برقم الجوال أو الهوية..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#2d7b33] transition-colors"
            />
            <svg className="absolute top-3 right-3.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <div className="flex gap-2">
            {kycFilters.map((f) => (
              <button
                key={f}
                onClick={() => setKycFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${kycFilter === f ? "bg-[#2d7b33] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">جاري التحميل...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">لا يوجد مستخدمون بعد</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right text-xs text-gray-400 font-semibold px-6 py-4">رقم الهوية</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">رقم الجوال</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">حالة KYC</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">الحالة</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">تاريخ الانضمام</th>
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelected(user.id === selected ? null : user.id)}
                    className={`transition-colors cursor-pointer ${i < filtered.length - 1 ? "border-b border-gray-50" : ""} ${selected === user.id ? "bg-[#e8f5e9]" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-[#2d7b33]">{user.national_id[0]}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#1a1a1a]">{user.national_id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.phone}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${kycColors[user.kyc_status]}`}>
                        {kycMap[user.kyc_status]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[user.status]}`}>
                        {statusMap[user.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-4">
                      <button className="text-[#2d7b33] text-xs font-medium hover:underline">عرض</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* User Detail Panel */}
      {selectedUser && (
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1a1a1a] text-sm">بيانات المستخدم</h3>
              <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-lg leading-none">✕</button>
            </div>
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 rounded-2xl bg-[#e8f5e9] flex items-center justify-center mb-3">
                <span className="text-2xl font-extrabold text-[#2d7b33]">{selectedUser.national_id[0]}</span>
              </div>
              <p className="font-bold text-[#1a1a1a]">{selectedUser.national_id}</p>
              <p className="text-xs text-gray-400 mt-0.5">{selectedUser.phone}</p>
              <span className={`text-xs font-medium px-3 py-1 rounded-full mt-2 ${kycColors[selectedUser.kyc_status]}`}>
                {kycMap[selectedUser.kyc_status]}
              </span>
            </div>
            <div className="flex flex-col gap-3 py-4 border-y border-gray-50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">تاريخ الانضمام</span>
                <span className="font-bold text-[#1a1a1a]">{formatDate(selectedUser.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">حالة الحساب</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[selectedUser.status]}`}>
                  {statusMap[selectedUser.status]}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {selectedUser.kyc_status === "pending" && (
                <>
                  <button
                    onClick={() => updateKyc(selectedUser.id, "complete")}
                    className="w-full bg-[#2d7b33] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors"
                  >
                    ✓ قبول KYC
                  </button>
                  <button
                    onClick={() => updateKyc(selectedUser.id, "rejected")}
                    className="w-full bg-red-50 text-red-500 text-sm font-medium py-2.5 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    ✕ رفض KYC
                  </button>
                </>
              )}
              {selectedUser.status === "active" && (
                <button
                  onClick={() => updateStatus(selectedUser.id, "suspended")}
                  className="w-full border border-orange-200 text-orange-500 text-sm font-medium py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  تعليق الحساب
                </button>
              )}
              {selectedUser.status === "suspended" && (
                <button
                  onClick={() => updateStatus(selectedUser.id, "active")}
                  className="w-full bg-[#2d7b33] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors"
                >
                  تفعيل الحساب
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
