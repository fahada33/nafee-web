"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type User = { id: string; phone: string; full_name: string | null };

export default function AdminNotificationsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<"general" | "distribution" | "opportunity" | "kyc" | "deposit">("general");
  const [target, setTarget] = useState<"all" | "single">("all");
  const [targetUserId, setTargetUserId] = useState("");
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("users")
        .select("id, phone, full_name")
        .neq("status", "deleted")
        .order("created_at", { ascending: false });
      setUsers((data ?? []) as User[]);
      setLoading(false);
    })();
  }, []);

  async function send() {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setSentCount(null);

    const targets = target === "all" ? users : users.filter((u) => u.id === targetUserId);
    const rows = targets.map((u) => ({
      user_id: u.id,
      title: title.trim(),
      body: body.trim(),
      type,
    }));

    if (rows.length > 0) {
      await supabase.from("notifications").insert(rows);
    }

    setSentCount(rows.length);
    setSending(false);
    setTitle("");
    setBody("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-bold text-[#1a1a1a] text-lg">إرسال إشعار</h2>
        <p className="text-xs text-gray-400 mt-1">يظهر الإشعار في شاشة الإشعارات داخل التطبيق لكل المستخدمين المختارين</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4 max-w-2xl">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">المستهدفون</label>
          <div className="flex gap-2">
            {(["all", "single"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  target === t
                    ? "bg-[#e8f5e9] border-[#2d7b33] text-[#2d7b33]"
                    : "bg-white border-gray-200 text-gray-500"
                }`}
              >
                {t === "all" ? `كل المستخدمين (${users.length})` : "مستخدم محدد"}
              </button>
            ))}
          </div>
        </div>

        {target === "single" && (
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">اختر المستخدم</label>
            <select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d7b33] bg-white"
            >
              <option value="">— اختر —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name ?? "—"} · {u.phone}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">نوع الإشعار</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d7b33] bg-white"
          >
            <option value="general">عام</option>
            <option value="kyc">KYC / التحقق</option>
            <option value="distribution">توزيع دخل إيجاري</option>
            <option value="opportunity">فرصة جديدة</option>
            <option value="deposit">شحن محفظة</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">العنوان</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: تم صرف الدخل الإيجاري"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d7b33]"
            maxLength={80}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">النص</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="تفاصيل الإشعار..."
            rows={4}
            maxLength={280}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d7b33] resize-none"
          />
          <p className="text-[10px] text-gray-400 mt-1">{body.length}/280</p>
        </div>

        <button
          onClick={send}
          disabled={sending || !title.trim() || !body.trim() || (target === "single" && !targetUserId) || loading}
          className="bg-[#2d7b33] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#1f5a24] transition-colors disabled:opacity-50"
        >
          {sending ? "جارٍ الإرسال..." : "إرسال الإشعار"}
        </button>

        {sentCount !== null && (
          <div className="bg-[#e8f5e9] text-[#2d7b33] rounded-xl p-3 text-sm text-center">
            تم إرسال الإشعار إلى {sentCount} مستخدم
          </div>
        )}
      </div>
    </div>
  );
}
