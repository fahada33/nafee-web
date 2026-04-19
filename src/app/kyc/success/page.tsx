import Link from "next/link";

export default function KYCSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4 font-[family-name:var(--font-tajawal)]">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-md px-8 py-14 flex flex-col items-center text-center">

        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M10 24L20 34L38 14" stroke="#2d7b33" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-[#1a1a1a] mb-3">تم بنجاح!</h1>
        <p className="text-gray-400 leading-relaxed mb-8">
          تم إنشاء حسابك والتحقق من هويتك بنجاح.<br />
          أنت الآن جاهز للاستثمار في نافع.
        </p>

        <Link
          href="/home"
          className="w-full bg-[#2d7b33] text-white font-bold py-4 rounded-xl hover:bg-[#1f5a24] transition-colors text-center"
        >
          ابدأ الاستثمار
        </Link>
      </div>
    </main>
  );
}
