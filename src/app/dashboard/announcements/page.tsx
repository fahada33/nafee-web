"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Announcement = {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning" | "success";
  active: boolean;
  created_at: string;
};

const severityStyles: Record<string, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-700",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
  success: "bg-[#e8f5e9] border-[#2d7b33]/20 text-[#2d7b33]",
};

const severityLabels: Record<string, string> = {
  info: "معلومة",
  warning: "تحذير",
  success: "خبر إيجابي",
};

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState<"info" | "warning" | "success">("info");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Announcement[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const channel = supabase
      .channel("announcements-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function publish() {
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    await supabase
      .from("announcements")
      .insert({ title: title.trim(), body: body.trim(), severity, active: true });
    setTitle("");
    setBody("");
    setSeverity("info");
    setComposing(false);
    setSubmitting(false);
  }

  async function toggleActive(a: Announcement) {
    await supabase
      .from("announcements")
      .update({ active: !a.active })
      .eq("id", a.id);
  }

  async function remove(a: Announcement) {
    if (!confirm(`حذف الإعلان "${a.title}"؟`)) return;
    await supabase.from("announcements").delete().eq("id", a.id);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{items.filter((i) => i.active).length} إعلان نشط</p>
        </div>
        <button
          onClick={() => setComposing(!composing)}
          className="bg-[#2d7b33] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors"
        >
          {composing ? "إلغاء" : "+ إعلان جديد"}
        </button>
      </div>

      {composing && (
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <h3 className="font-bold text-[#1a1a1a]">إعلان جديد</h3>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="العنوان"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d7b33]"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="نص الإعلان..."
            rows={4}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d7b33] resize-none"
          />
          <div className="flex gap-2">
            {(["info", "success", "warning"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  severity === s
                    ? severityStyles[s] + " border-current"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {severityLabels[s]}
              </button>
            ))}
          </div>
          <button
            onClick={publish}
            disabled={submitting || !title.trim() || !body.trim()}
            className="bg-[#2d7b33] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#1f5a24] transition-colors disabled:opacity-50"
          >
            {submitting ? "جارٍ النشر..." : "نشر الإعلان"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-12 text-sm">جاري التحميل...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-4xl mb-3">📢</p>
          <p className="text-gray-400 text-sm">لا توجد إعلانات بعد</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((a) => (
            <div key={a.id} className={`bg-white rounded-2xl shadow-sm p-5 border-r-4 ${a.active ? severityStyles[a.severity] : "border-gray-200 opacity-60"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-[#1a1a1a]">{a.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${severityStyles[a.severity]}`}>
                      {severityLabels[a.severity]}
                    </span>
                    {!a.active && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">متوقف</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{a.body}</p>
                  <p className="text-[10px] text-gray-300 mt-3">
                    {new Date(a.created_at).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(a)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                  >
                    {a.active ? "إيقاف" : "تفعيل"}
                  </button>
                  <button
                    onClick={() => remove(a)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
