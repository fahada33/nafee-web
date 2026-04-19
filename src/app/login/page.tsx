"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [idNumber, setIdNumber] = useState("");

  return (
    <div className="min-h-screen bg-[#2d7b33] flex flex-col items-center justify-center px-4 font-[family-name:var(--font-tajawal)]">

      {/* Top Logo Area */}
      <div className="flex flex-col items-center mb-8">
        <img src="/logo.svg" alt="نافع" className="h-14 w-auto brightness-0 invert mb-3" />
        <p className="text-white/70 text-sm">استثمر في حقوق المنفعة العقارية</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl w-full max-w-sm px-7 py-8 shadow-xl">
        <h1 className="text-xl font-extrabold text-[#1a1a1a] mb-1">مرحباً بك</h1>
        <p className="text-gray-400 text-sm mb-6">سجّل دخولك للمتابعة</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">رقم الهوية الوطنية</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="1xxxxxxxxx"
              maxLength={10}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-right text-[#1a1a1a] placeholder-gray-300 focus:outline-none focus:border-[#2d7b33] transition-colors text-base bg-gray-50"
            />
          </div>

          <button
            disabled={idNumber.length !== 10}
            className="w-full bg-[#2d7b33] text-white font-bold py-4 rounded-xl hover:bg-[#1f5a24] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            تسجيل الدخول عبر نفاذ
          </button>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-300 text-xs">أو</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-center text-sm text-gray-400">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-[#2d7b33] font-bold hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>

      <Link href="/" className="mt-6 text-white/50 text-sm hover:text-white transition-colors">
        ← العودة للرئيسية
      </Link>
    </div>
  );
}
