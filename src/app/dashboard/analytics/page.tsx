const months = ["مايو", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس", "يناير", "فبر", "مارس", "أبريل"];
const investmentBars = [55, 70, 45, 80, 65, 90, 75, 95, 85, 100, 88, 92];
const userBars = [30, 45, 50, 60, 55, 70, 65, 80, 75, 90, 85, 95];

const topOpportunities = [
  { title: "برج الأعمال", invested: 1360000, investors: 142, return: "12%", share: 35 },
  { title: "فيلا بريميوم", invested: 800000, investors: 64, return: "9%", share: 21 },
  { title: "مجمع الواحة", invested: 675000, investors: 87, return: "10%", share: 17 },
  { title: "مركز لوجستي", invested: 660000, investors: 38, return: "14%", share: 17 },
  { title: "مول التجمع", invested: 400000, investors: 51, return: "11%", share: 10 },
];

const kycStats = [
  { label: "مكتمل", value: 1190, percent: 93, color: "bg-[#2d7b33]" },
  { label: "قيد المراجعة", value: 62, percent: 5, color: "bg-orange-400" },
  { label: "مرفوض", value: 32, percent: 2, color: "bg-red-400" },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "إجمالي الاستثمارات", value: "12.4M ريال", change: "+18%", icon: "💰" },
          { label: "إجمالي المستثمرين", value: "1,284", change: "+12%", icon: "👥" },
          { label: "إجمالي التوزيعات", value: "1.2M ريال", change: "منذ البداية", icon: "📤" },
          { label: "متوسط الاستثمار", value: "9,658 ريال", change: "لكل مستثمر", icon: "📊" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className="text-xs text-[#2d7b33] bg-[#e8f5e9] px-2.5 py-1 rounded-full font-medium">{kpi.change}</span>
            </div>
            <p className="text-xl font-extrabold text-[#1a1a1a]">{kpi.value}</p>
            <p className="text-sm text-gray-400 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Investment Growth */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#1a1a1a]">نمو الاستثمارات</h3>
              <p className="text-xs text-gray-400 mt-0.5">آخر 12 شهر</p>
            </div>
            <span className="text-xs text-[#2d7b33] bg-[#e8f5e9] px-3 py-1 rounded-full font-medium">↑ 18%</span>
          </div>
          <div className="flex items-end gap-2 h-36">
            {investmentBars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-md ${i === investmentBars.length - 1 ? "bg-[#2d7b33]" : "bg-[#2d7b33]/20"}`}
                  style={{ height: `${h * 1.3}px` }}
                />
                <span className="text-gray-400 writing-mode-vertical" style={{ fontSize: "8px" }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#1a1a1a]">نمو المستخدمين</h3>
              <p className="text-xs text-gray-400 mt-0.5">آخر 12 شهر</p>
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">↑ 12%</span>
          </div>
          <div className="flex items-end gap-2 h-36">
            {userBars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-md ${i === userBars.length - 1 ? "bg-blue-500" : "bg-blue-200"}`}
                  style={{ height: `${h * 1.3}px` }}
                />
                <span className="text-gray-400" style={{ fontSize: "8px" }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Opportunities + KYC */}
      <div className="grid grid-cols-3 gap-4">
        {/* Top Opportunities */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-bold text-[#1a1a1a]">أداء الفرص الاستثمارية</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right text-xs text-gray-400 font-semibold px-6 py-3">الفرصة</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الاستثمارات</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">المستثمرون</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">العائد</th>
                <th className="text-right text-xs text-gray-400 font-semibold px-4 py-3">الحصة</th>
              </tr>
            </thead>
            <tbody>
              {topOpportunities.map((opp, i) => (
                <tr key={opp.title} className={`hover:bg-gray-50 ${i < topOpportunities.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <td className="px-6 py-3.5 text-sm font-semibold text-[#1a1a1a]">{opp.title}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{opp.invested.toLocaleString()} ريال</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{opp.investors}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-[#2d7b33]">{opp.return}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#2d7b33] h-1.5 rounded-full" style={{ width: `${opp.share}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{opp.share}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* KYC Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#1a1a1a] mb-5">حالة KYC</h3>
          <div className="flex flex-col gap-4">
            {kycStats.map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500">{stat.label}</span>
                  <span className="font-bold text-[#1a1a1a]">{stat.value.toLocaleString()}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`${stat.color} h-2.5 rounded-full transition-all`} style={{ width: `${stat.percent}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{stat.percent}% من الإجمالي</p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-50">
            <h4 className="text-sm font-bold text-[#1a1a1a] mb-3">توزيع الاستثمار</h4>
            {[
              { label: "أقل من 10K", percent: 28 },
              { label: "10K - 50K", percent: 45 },
              { label: "50K - 200K", percent: 22 },
              { label: "أكثر من 200K", percent: 5 },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">{r.label} ريال</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-100 rounded-full h-1.5">
                    <div className="bg-[#c9a84c] h-1.5 rounded-full" style={{ width: `${r.percent}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{r.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
