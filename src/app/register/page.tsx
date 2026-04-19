"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const steps = ["نفاذ", "التحقق", "بياناتك"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else router.push("/kyc");
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4 font-[family-name:var(--font-tajawal)]">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-md px-8 py-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="نافع" className="h-12 w-auto" />
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((label, i) => {
            const num = i + 1;
            const active = num === step;
            const done = num < step;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                      ${done ? "bg-[#2d7b33] text-white" : active ? "bg-[#2d7b33] text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    {done ? "✓" : num}
                  </div>
                  <span className={`text-xs ${active ? "text-[#2d7b33] font-semibold" : "text-gray-400"}`}>{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-10 h-0.5 mb-4 ${done ? "bg-[#2d7b33]" : "bg-gray-100"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Nafath ID */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold text-center text-[#1a1a1a]">التحقق عبر نفاذ</h1>
            <p className="text-gray-400 text-center text-sm mb-2">أدخل رقم هويتك الوطنية للتحقق عبر نفاذ</p>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#1a1a1a]">رقم الهوية الوطنية</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="1xxxxxxxxx"
                maxLength={10}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right text-[#1a1a1a] placeholder-gray-300 focus:outline-none focus:border-[#2d7b33] transition-colors text-base"
              />
            </div>
            <button
              onClick={handleNext}
              disabled={idNumber.length !== 10}
              className="w-full bg-[#2d7b33] text-white font-bold py-4 rounded-xl hover:bg-[#1f5a24] transition-colors mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              التحقق عبر نفاذ
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold text-center text-[#1a1a1a]">رمز التحقق</h1>
            <p className="text-gray-400 text-center text-sm mb-2">
              تم إرسال رمز التحقق لجوالك المسجل في نفاذ
            </p>
            <div className="flex gap-3 justify-center direction-ltr">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-14 h-14 text-center text-2xl font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-[#2d7b33] transition-colors"
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-[#2d7b33] text-white font-bold py-4 rounded-xl hover:bg-[#1f5a24] transition-colors mt-2"
            >
              تأكيد
            </button>
            <button className="text-[#2d7b33] text-sm text-center font-medium hover:underline">
              إعادة إرسال الرمز
            </button>
          </div>
        )}

        {/* Step 3: Account Details */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold text-center text-[#1a1a1a]">بياناتك الشخصية</h1>
            <p className="text-gray-400 text-center text-sm mb-2">أدخل بياناتك لإكمال إنشاء الحساب</p>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#1a1a1a]">رقم الجوال</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                maxLength={10}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right text-[#1a1a1a] placeholder-gray-300 focus:outline-none focus:border-[#2d7b33] transition-colors text-base"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#1a1a1a]">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right text-[#1a1a1a] placeholder-gray-300 focus:outline-none focus:border-[#2d7b33] transition-colors text-base"
              />
            </div>
            <div className="flex items-start gap-3 mt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#2d7b33] cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-500 cursor-pointer leading-relaxed">
                أوافق على{" "}
                <Link href="/terms" className="text-[#2d7b33] font-medium hover:underline">
                  الشروط والأحكام
                </Link>{" "}
                و{" "}
                <Link href="/privacy" className="text-[#2d7b33] font-medium hover:underline">
                  سياسة الخصوصية
                </Link>
              </label>
            </div>
            <button
              onClick={handleNext}
              disabled={!phone || !email || !agreed}
              className="w-full bg-[#2d7b33] text-white font-bold py-4 rounded-xl hover:bg-[#1f5a24] transition-colors mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              إنشاء الحساب والمتابعة
            </button>
          </div>
        )}

        {/* Login Link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-[#2d7b33] font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>

      <Link href="/" className="mt-6 text-gray-400 text-sm hover:text-[#2d7b33] transition-colors">
        → العودة للرئيسية
      </Link>
    </main>
  );
}
