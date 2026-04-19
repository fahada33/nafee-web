import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import AppShell from "@/components/AppShell";
import Link from "next/link";

const menuSections = [
  {
    title: "الحساب",
    items: [
      { label: "بياناتي الشخصية", href: "/profile/personal", icon: "👤" },
      { label: "إعدادات الأمان", href: "/profile/security", icon: "🔒" },
      { label: "التحقق من الهوية", href: "/kyc", icon: "✅", badge: "مكتمل", badgeGreen: true },
    ],
  },
  {
    title: "المالية",
    items: [
      { label: "المحفظة والمدفوعات", href: "/wallet", icon: "💳" },
      { label: "محفظتي الاستثمارية", href: "/portfolio", icon: "📈" },
    ],
  },
  {
    title: "الإعدادات",
    items: [
      { label: "الإشعارات", href: "/profile/notifications", icon: "🔔" },
      { label: "اللغة", href: "/profile/language", icon: "🌐", badge: "عربي" },
      { label: "الدعم والمساعدة", href: "/profile/support", icon: "💬" },
    ],
  },
  {
    title: "قانوني",
    items: [
      { label: "الشروط والأحكام", href: "/terms", icon: "📄" },
      { label: "سياسة الخصوصية", href: "/privacy", icon: "🛡️" },
    ],
  },
];

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="min-h-screen bg-[#f5f5f5] pb-24">
        <TopBar title="حسابي" />

        {/* User Card */}
        <div className="bg-white mx-4 mt-4 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-extrabold text-[#2d7b33]">م</span>
            </div>
            <div className="flex-1">
              <h2 className="font-extrabold text-[#1a1a1a] text-lg">محمد العتيبي</h2>
              <p className="text-sm text-gray-400 mt-0.5">mohammed@email.com</p>
              <p className="text-sm text-gray-400">+966 5x xxx xxxx</p>
            </div>
            <div className="bg-[#e8f5e9] px-3 py-1.5 rounded-full">
              <span className="text-xs font-semibold text-[#2d7b33]">مُحقَّق</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-50">
            <div className="text-center">
              <p className="font-extrabold text-[#2d7b33] text-xl">4</p>
              <p className="text-xs text-gray-400 mt-0.5">استثمارات</p>
            </div>
            <div className="text-center border-x border-gray-50">
              <p className="font-extrabold text-[#2d7b33] text-base">168,500</p>
              <p className="text-xs text-gray-400 mt-0.5">ريال مستثمر</p>
            </div>
            <div className="text-center">
              <p className="font-extrabold text-[#2d7b33] text-xl">10.2%</p>
              <p className="text-xs text-gray-400 mt-0.5">متوسط العائد</p>
            </div>
          </div>
        </div>

        {/* Nafee Brand Bar */}
        <div className="mx-4 mt-3 bg-gradient-to-l from-[#1f5a24] to-[#2d7b33] rounded-2xl p-4 flex items-center gap-3">
          <img src="/logo.svg" alt="نافع" className="h-8 w-auto brightness-0 invert opacity-80" />
          <div>
            <p className="text-white font-bold text-sm">منصة نافع</p>
            <p className="text-white/60 text-xs">للاستثمار في حقوق المنفعة العقارية</p>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="mx-4 mt-4 flex flex-col gap-4">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="text-xs text-gray-400 font-semibold mb-2 px-1">{section.title}</p>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                {section.items.map((item, i) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors ${i < section.items.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg w-7 text-center">{item.icon}</span>
                      <span className="text-sm text-[#1a1a1a] font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${item.badgeGreen ? "bg-[#e8f5e9] text-[#2d7b33]" : "bg-gray-100 text-gray-500"}`}>
                          {item.badge}
                        </span>
                      )}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <button className="w-full bg-white rounded-2xl py-4 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors shadow-sm">
            تسجيل الخروج
          </button>
          <p className="text-center text-xs text-gray-300 pb-2">نافع © 2025 · جميع الحقوق محفوظة</p>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
