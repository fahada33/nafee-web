"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ADMIN_EMAIL = "majed@nafee.net";
const ADMIN_PASSWORD = "Mm@123123";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 400));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      document.cookie = "nafee_admin_auth=authenticated; path=/; max-age=86400";
      router.push("/dashboard");
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-[#f5f7fa] flex items-center justify-center font-[family-name:var(--font-tajawal)]"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.svg" alt="نافع" width={80} height={40} className="mb-3" />
          <p className="text-sm text-gray-400">لوحة التحكم الإدارية</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nafee.net"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2d7b33] focus:ring-1 focus:ring-[#2d7b33] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2d7b33] focus:ring-1 focus:ring-[#2d7b33] transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#2d7b33] text-white text-sm font-semibold hover:bg-[#256028] transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
