"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  national_id: string;
  phone: string;
  full_name: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  id_expiry_date: string | null;
  kyc_status: string;
  kyc_reviewed_by: string | null;
  kyc_reviewed_at: string | null;
  status: string;
  suspension_reason: string | null;
  last_login_at: string | null;
  risk_profile: string | null;
  accredited_investor: boolean;
  pep_status: boolean;
  created_at: string;
};

type OpportunityRef = { title: string; location: string; return_percent: number };

type Investment = {
  id: string;
  amount: number;
  shares_count: number;
  status: string;
  created_at: string;
  opportunities: OpportunityRef | OpportunityRef[] | null;
};

function getOpportunity(inv: Investment): OpportunityRef | null {
  if (!inv.opportunities) return null;
  return Array.isArray(inv.opportunities) ? inv.opportunities[0] ?? null : inv.opportunities;
}

type UserStats = {
  total_invested: number;
  active_count: number;
  investments: Investment[];
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

const riskMap: Record<string, string> = {
  conservative: "محافظ",
  moderate: "متوسط",
  aggressive: "مغامر",
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

const invStatusColors: Record<string, string> = {
  active: "bg-[#e8f5e9] text-[#2d7b33]",
  pending: "bg-orange-50 text-orange-500",
  exited: "bg-gray-100 text-gray-400",
};

const invStatusMap: Record<string, string> = {
  active: "نشط",
  pending: "معلق",
  exited: "منتهي",
};

const kycFilters = ["الكل", "مكتمل", "قيد المراجعة", "مرفوض"];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
}

function formatDateShort(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ar-SA", { year: "numeric", month: "numeric", day: "numeric" });
}

function timeAgo(iso: string | null) {
  if (!iso) return "لم يسجل دخولاً بعد";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${Math.floor(hours / 24)} يوم`;
}

function getAge(dob: string | null) {
  if (!dob) return null;
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

function displayName(user: User) { return user.full_name || user.national_id; }
function displayInitial(user: User) { return (user.full_name || user.national_id)[0]; }

function fmtMoney(n: number) {
  return n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}م`
    : n >= 1000
    ? `${(n / 1000).toFixed(0)}ك`
    : String(n);
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("الكل");
  const [selected, setSelected] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    const channel = supabase
      .channel("users-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, fetchUsers)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!selected) { setUserStats(null); return; }
    fetchUserStats(selected);
  }, [selected]);

  async function fetchUsers() {
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    setUsers(data ?? []);
    setLoading(false);
  }

  async function fetchUserStats(userId: string) {
    setStatsLoading(true);
    const { data } = await supabase
      .from("investments")
      .select("id, amount, shares_count, status, created_at, opportunities(title, location, return_percent)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const investments = (data ?? []) as Investment[];
    const total_invested = investments.reduce((s, i) => s + i.amount, 0);
    const active_count = investments.filter(i => i.status === "active").length;
    setUserStats({ total_invested, active_count, investments });
    setStatsLoading(false);
  }

  async function approveKyc(id: string) {
    await supabase.from("users").update({
      kyc_status: "complete", status: "active",
      kyc_reviewed_by: "majed@nafee.net",
      kyc_reviewed_at: new Date().toISOString(),
    }).eq("id", id);
  }

  async function rejectKyc(id: string) {
    await supabase.from("users").update({
      kyc_status: "rejected",
      kyc_reviewed_by: "majed@nafee.net",
      kyc_reviewed_at: new Date().toISOString(),
    }).eq("id", id);
  }

  async function suspendUser(id: string) {
    await supabase.from("users").update({ status: "suspended", suspension_reason: suspendReason || null }).eq("id", id);
    setShowSuspendModal(false);
    setSuspendReason("");
  }

  async function activateUser(id: string) {
    await supabase.from("users").update({ status: "active", suspension_reason: null }).eq("id", id);
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.phone.includes(search) || u.national_id.includes(search) || (u.full_name?.toLowerCase() ?? "").includes(q);
    const matchKyc = kycFilter === "الكل" || kycMap[u.kyc_status] === kycFilter;
    return matchSearch && matchKyc;
  });

  const selectedUser = users.find((u) => u.id === selected);

  return (
    <div className="flex gap-5">
      <div className="flex-1 flex flex-col gap-5 min-w-0">

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
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو الجوال أو الهوية..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#2d7b33] transition-colors"
            />
            <svg className="absolute top-3 right-3.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <div className="flex gap-2">
            {kycFilters.map((f) => (
              <button key={f} onClick={() => setKycFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${kycFilter === f ? "bg-[#2d7b33] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
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
            <div className="text-center py-16 text-gray-400 text-sm">لا يوجد مستخدمون</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right text-xs text-gray-400 font-semibold px-6 py-4">المستخدم</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">الجوال</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">الجنسية</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">حالة KYC</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">الحالة</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">آخر دخول</th>
                  <th className="text-right text-xs text-gray-400 font-semibold px-4 py-4">تاريخ الانضمام</th>
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr key={user.id} onClick={() => setSelected(user.id === selected ? null : user.id)}
                    className={`transition-colors cursor-pointer ${i < filtered.length - 1 ? "border-b border-gray-50" : ""} ${selected === user.id ? "bg-[#e8f5e9]" : "hover:bg-gray-50"}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-[#2d7b33]">{displayInitial(user)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1a1a1a]">{displayName(user)}</p>
                          <p className="text-xs text-gray-400">{user.national_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.phone}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.nationality ?? "—"}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${kycColors[user.kyc_status]}`}>{kycMap[user.kyc_status]}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[user.status]}`}>{statusMap[user.status]}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400">{timeAgo(user.last_login_at)}</td>
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

      {/* Detail Panel */}
      {selectedUser && (
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24 flex flex-col gap-4 max-h-[calc(100vh-120px)] overflow-y-auto">

            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#1a1a1a] text-sm">بيانات المستخدم</h3>
              <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-lg leading-none">✕</button>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#e8f5e9] flex items-center justify-center mb-3">
                <span className="text-2xl font-extrabold text-[#2d7b33]">{displayInitial(selectedUser)}</span>
              </div>
              <p className="font-bold text-[#1a1a1a] text-base">{displayName(selectedUser)}</p>
              <p className="text-xs text-gray-400 mt-0.5">{selectedUser.phone}</p>
              <div className="flex gap-2 mt-2 flex-wrap justify-center">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${kycColors[selectedUser.kyc_status]}`}>KYC: {kycMap[selectedUser.kyc_status]}</span>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[selectedUser.status]}`}>{statusMap[selectedUser.status]}</span>
              </div>
            </div>

            {/* Investment Summary */}
            {statsLoading ? (
              <div className="bg-gray-50 rounded-xl p-3 text-center text-xs text-gray-400">جاري تحميل العقود...</div>
            ) : userStats && (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#e8f5e9] rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-[#2d7b33]">{userStats.active_count}</p>
                  <p className="text-xs text-[#2d7b33] mt-0.5">فرصة نشطة</p>
                </div>
                <div className="bg-[#e8f5e9] rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-[#2d7b33]">{fmtMoney(userStats.total_invested)}</p>
                  <p className="text-xs text-[#2d7b33] mt-0.5">ريال تملُّك</p>
                </div>
              </div>
            )}

            {/* Identity */}
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 mb-1">بيانات الهوية</p>
              <Row label="رقم الهوية" value={selectedUser.national_id} />
              <Row label="الجنسية" value={selectedUser.nationality ?? "—"} />
              <Row label="تاريخ الميلاد" value={
                selectedUser.date_of_birth
                  ? `${formatDateShort(selectedUser.date_of_birth)} (${getAge(selectedUser.date_of_birth)} سنة)`
                  : "—"
              } />
              <Row label="انتهاء الهوية" value={formatDateShort(selectedUser.id_expiry_date)}
                warn={selectedUser.id_expiry_date ? new Date(selectedUser.id_expiry_date) < new Date() : false} />
            </div>

            {/* Activity */}
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 mb-1">النشاط</p>
              <Row label="تاريخ الانضمام" value={formatDate(selectedUser.created_at)} />
              <Row label="آخر دخول" value={timeAgo(selectedUser.last_login_at)} />
            </div>

            {/* Compliance */}
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 mb-1">الامتثال</p>
              <Row label="ملف المخاطر" value={riskMap[selectedUser.risk_profile ?? "moderate"]} />
              <Row label="مالك معتمد" value={selectedUser.accredited_investor ? "نعم" : "لا"} />
              <Row label="PEP" value={selectedUser.pep_status ? "نعم ⚠️" : "لا"} />
              {selectedUser.kyc_reviewed_by && <Row label="راجع KYC" value={selectedUser.kyc_reviewed_by} />}
              {selectedUser.kyc_reviewed_at && <Row label="تاريخ المراجعة" value={formatDateShort(selectedUser.kyc_reviewed_at)} />}
            </div>

            {/* Investments list */}
            {userStats && userStats.investments.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-gray-400">العقود ({userStats.investments.length})</p>
                {userStats.investments.map((inv) => (
                  <div key={inv.id} className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#1a1a1a] truncate flex-1">{getOpportunity(inv)?.title ?? "—"}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mr-2 ${invStatusColors[inv.status]}`}>{invStatusMap[inv.status]}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{getOpportunity(inv)?.location}</span>
                      <span className="font-semibold text-[#1a1a1a]">{inv.amount.toLocaleString()} ريال</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedUser.status === "suspended" && selectedUser.suspension_reason && (
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-xs font-bold text-red-400 mb-1">سبب التعليق</p>
                <p className="text-xs text-red-600">{selectedUser.suspension_reason}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {selectedUser.kyc_status === "pending" && (
                <>
                  <button onClick={() => approveKyc(selectedUser.id)}
                    className="w-full bg-[#2d7b33] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors">
                    ✓ قبول KYC
                  </button>
                  <button onClick={() => rejectKyc(selectedUser.id)}
                    className="w-full bg-red-50 text-red-500 text-sm font-medium py-2.5 rounded-xl hover:bg-red-100 transition-colors">
                    ✕ رفض KYC
                  </button>
                </>
              )}
              {selectedUser.status === "active" && (
                <button onClick={() => setShowSuspendModal(true)}
                  className="w-full border border-orange-200 text-orange-500 text-sm font-medium py-2.5 rounded-xl hover:bg-orange-50 transition-colors">
                  تعليق الحساب
                </button>
              )}
              {selectedUser.status === "suspended" && (
                <button onClick={() => activateUser(selectedUser.id)}
                  className="w-full bg-[#2d7b33] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors">
                  تفعيل الحساب
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowSuspendModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-[#1a1a1a] mb-1">تعليق الحساب</h3>
            <p className="text-sm text-gray-400 mb-4">أدخل سبب التعليق (اختياري)</p>
            <textarea value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="مثال: مخالفة شروط الاستخدام..." rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-orange-400 transition-colors mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowSuspendModal(false)}
                className="flex-1 border border-gray-200 text-gray-500 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
              <button onClick={() => suspendUser(selectedUser.id)}
                className="flex-1 bg-orange-500 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-orange-600 transition-colors">
                تعليق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-gray-400">{label}</span>
      <span className={`font-semibold ${warn ? "text-red-500" : "text-[#1a1a1a]"}`}>{value}</span>
    </div>
  );
}
