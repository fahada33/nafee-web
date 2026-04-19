import Link from "next/link";

const stats = [
  { label: "إجمالي الملاك", value: "1,284", change: "+12%", positive: true, icon: "👥" },
  { label: "العقارات النشطة", value: "8", change: "+2", positive: true, icon: "🏢" },
  { label: "إجمالي قيمة الوحدات", value: "12.4M", change: "+8%", positive: true, icon: "💰", unit: "ريال" },
  { label: "التوزيعات هذا الشهر", value: "340K", change: "على الموعد", positive: true, icon: "📤", unit: "ريال" },
];

const recentOpportunities = [
  { id: "1", title: "برج الأعمال - الرياض", status: "تمويل مفتوح", funded: 68, target: "2,000,000", investors: 142 },
  { id: "2", title: "مجمع الواحة - جدة", status: "تمويل مفتوح", funded: 45, target: "1,500,000", investors: 87 },
  { id: "3", title: "فيلا بريميوم - الدمام", status: "مكتمل التمويل", funded: 100, target: "800,000", investors: 64 },
  { id: "4", title: "مركز لوجستي - الرياض", status: "تمويل مفتوح", funded: 22, target: "3,000,000", investors: 38 },
];

const recentUsers = [
  { name: "محمد العتيبي", email: "m.otaibi@email.com", kyc: "مكتمل", invested: "168,500", date: "اليوم" },
  { name: "سارة القحطاني", email: "s.qahtani@email.com", kyc: "مكتمل", invested: "50,000", date: "اليوم" },
  { name: "عبدالله الدوسري", email: "a.dosari@email.com", kyc: "قيد المراجعة", invested: "—", date: "أمس" },
  { name: "نورة الشمري", email: "n.shamri@email.com", kyc: "مكتمل", invested: "95,000", date: "أمس" },
  { name: "خالد الزهراني", email: "k.zahrani@email.com", kyc: "مكتمل", invested: "200,000", date: "منذ يومين" },
];

const statusColors: Record<string, string> = {
  "مسودة":          "bg-gray-100 text-gray-500",       // DRAFT
  "تمويل مفتوح":   "bg-[#e8f5e9] text-[#2d7b33]",    // FUNDING
  "مكتمل التمويل": "bg-blue-50 text-blue-600",         // FUNDED
  "نشط":            "bg-purple-50 text-purple-600",    // ACTIVE
  "مكتمل":          "bg-gray-100 text-gray-500",       // COMPLETED
  "ملغي":           "bg-red-50 text-red-500",          // CANCELLED
};

const kycColors: Record<string, string> = {
  "مكتمل": "bg-[#e8f5e9] text-[#2d7b33]",
  "قيد المراجعة": "bg-orange-50 text-orange-500",
  "مرفوض": "bg-red-50 text-red-500",
};

const bars = [55, 70, 45, 80, 65, 90, 75, 95, 85, 100, 88, 92];
const months = ["مايو", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس", "يناير", "فبر", "مارس", "أبريل"];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1a1a]">مرحباً، مدير النظام 👋</h2>
          <p className="text-gray-400 text-sm mt-1">إليك ملخص المنصة اليوم</p>
        </div>
        <Link
          href="/dashboard/opportunities/new"
          className="bg-[#2d7b33] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors flex items-center gap-2 text-sm"
        >
          <span className="text-lg leading-none">+</span> فرصة جديدة
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${stat.positive ? "bg-[#e8f5e9] text-[#2d7b33]" : "bg-red-50 text-red-500"}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-[#1a1a1a]">
              {stat.value} <span className="text-sm font-medium text-gray-400">{stat.unit}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-3 gap-4">
        {/* Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#1a1a1a]">نمو المنصة</h3>
            <span className="text-xs text-[#2d7b33] bg-[#e8f5e9] px-3 py-1 rounded-full font-medium">↑ 18% هذا العام</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-lg transition-all ${i === bars.length - 1 ? "bg-[#2d7b33]" : "bg-[#2d7b33]/20"}`}
                  style={{ height: `${h * 1.4}px` }}
                />
                <span className="text-xs text-gray-400 rotate-45 origin-top-left" style={{ fontSize: "9px" }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-[#1a1a1a]">إحصائيات سريعة</h3>
          {[
            { label: "طلبات KYC معلقة", value: "23", color: "text-orange-500" },
            { label: "فرص تحتاج مراجعة", value: "2", color: "text-blue-500" },
            { label: "توزيعات مجدولة", value: "5", color: "text-[#2d7b33]" },
            { label: "طلبات سحب", value: "8", color: "text-purple-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className={`font-extrabold text-lg ${item.color}`}>{item.value}</span>
            </div>
          ))}
          <div className="mt-2 bg-[#e8f5e9] rounded-xl p-3 text-center">
            <p className="text-[#2d7b33] text-xs font-medium">التوزيع القادم</p>
            <p className="text-[#2d7b33] font-extrabold text-lg mt-0.5">15 مايو 2025</p>
          </div>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-[#1a1a1a]">الفرص الاستثمارية</h3>
          <Link href="/dashboard/opportunities" className="text-[#2d7b33] text-sm font-medium hover:underline">
            عرض الكل
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-right text-xs text-gray-400 font-semibold px-6 py-3">الفرصة</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الحالة</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">التمويل</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الهدف</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الملاك</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {recentOpportunities.map((opp, i) => (
              <tr key={opp.id} className={`hover:bg-gray-50 transition-colors ${i < recentOpportunities.length - 1 ? "border-b border-gray-50" : ""}`}>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-[#1a1a1a]">{opp.title}</p>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[opp.status] ?? "bg-gray-100 text-gray-500"}`}>
                    {opp.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-[#2d7b33] h-1.5 rounded-full" style={{ width: `${opp.funded}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{opp.funded}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">{opp.target} ريال</td>
                <td className="px-4 py-4 text-sm text-gray-500">{opp.investors} مالك</td>
                <td className="px-4 py-4">
                  <Link href={`/dashboard/opportunities`} className="text-[#2d7b33] text-xs font-medium hover:underline">
                    إدارة
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-[#1a1a1a]">آخر المستخدمين</h3>
          <Link href="/dashboard/users" className="text-[#2d7b33] text-sm font-medium hover:underline">
            عرض الكل
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-right text-xs text-gray-400 font-semibold px-6 py-3">المستخدم</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">حالة KYC</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">قيمة الوحدات</th>
              <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">تاريخ الانضمام</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user, i) => (
              <tr key={user.email} className={`hover:bg-gray-50 transition-colors ${i < recentUsers.length - 1 ? "border-b border-gray-50" : ""}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#2d7b33]">{user.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a1a]">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${kycColors[user.kyc] ?? "bg-gray-100 text-gray-500"}`}>
                    {user.kyc}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">{user.invested} {user.invested !== "—" ? "ريال" : ""}</td>
                <td className="px-4 py-4 text-sm text-gray-400">{user.date}</td>
                <td className="px-4 py-4">
                  <Link href="/dashboard/users" className="text-[#2d7b33] text-xs font-medium hover:underline">
                    عرض
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
