import Link from "next/link";

const opportunities = [
  { title: "برج الأعمال", location: "الرياض، حي العليا", type: "مكاتب تجارية", return: "12%", duration: "3 سنوات", minInvest: "5,000", distribution: "شهري", funded: 68, gradient: "from-[#1a4a2e] to-[#2d7b33]" },
  { title: "مجمع الواحة", location: "جدة، حي الزهراء", type: "تجزئة تجارية", return: "10%", duration: "2 سنة", minInvest: "3,000", distribution: "ربع سنوي", funded: 45, gradient: "from-[#1a3a4a] to-[#2d5f7b]" },
  { title: "مركز لوجستي", location: "الرياض، المنطقة الصناعية", type: "مستودعات", return: "14%", duration: "4 سنوات", minInvest: "8,000", distribution: "ربع سنوي", funded: 22, gradient: "from-[#3a2d1a] to-[#7b5a2d]" },
];

const steps = [
  { num: "01", title: "إنشاء الحساب", desc: "سجّل عبر نفاذ في دقائق. هويتك الوطنية هي كل ما تحتاجه للبدء.", icon: "🪪" },
  { num: "02", title: "استكمال KYC", desc: "أجب على بضعة أسئلة بسيطة لتحديد ملفك وفق متطلبات هيئة العقار.", icon: "✅" },
  { num: "03", title: "شحن المحفظة", desc: "أضف رصيداً عبر مدى أو فيزا أو تحويل بنكي. آمن ومشفّر.", icon: "💳" },
  { num: "04", title: "اختر فرصتك", desc: "تصفّح الفرص المتاحة، ادرس التفاصيل والمستندات، وتملّك بنقرة واحدة.", icon: "🏢" },
  { num: "05", title: "وقّع العقد", desc: "وقّع عقد حق المنفعة إلكترونياً وأكّد تملكك بشكل آمن وقانوني.", icon: "📝" },
  { num: "06", title: "استلم دخلك الإيجاري", desc: "تصل التوزيعات مباشرة لمحفظتك في المنصة وفق الجدول المحدد لكل فرصة.", icon: "💰" },
];

const modelItems = [
  {
    title: "حق المنفعة العقارية",
    desc: "لا تمتلك العقار، بل تمتلك حق الانتفاع منه. هيكل شرعي ومرن يتيح لك تملك وحدات منفعة في عقارات كبيرة بمبالغ صغيرة.",
    icon: "🏛️",
    color: "bg-[#e8f5e9]",
    textColor: "text-[#2d7b33]",
  },
  {
    title: "عوائد منتظمة",
    desc: "تحصل على توزيعات دورية من إيرادات الإيجار الفعلية. شهرية أو ربع سنوية أو نصف سنوية حسب كل فرصة.",
    icon: "📈",
    color: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    title: "فريق نافع يُدير",
    desc: "فريقنا المتخصص يختار العقارات ويُدير العمليات ويُدخل الدخل الإيجاري الفعلي. أنت تتملك، نحن ندير.",
    icon: "👷",
    color: "bg-orange-50",
    textColor: "text-orange-500",
  },
  {
    title: "متوافق مع الشريعة",
    desc: "جميع عقود نافع مبنية على هياكل شرعية معتمدة ومتوافقة مع المتطلبات التنظيمية السعودية.",
    icon: "⚖️",
    color: "bg-purple-50",
    textColor: "text-purple-600",
  },
];

const stats = [
  { value: "+50", label: "فرصة عقارية" },
  { value: "+1,200", label: "مالك نشط" },
  { value: "12%", label: "متوسط الدخل الإيجاري" },
  { value: "340K", label: "ريال وُزّعت هذا الشهر" },
];

const faqs = [
  { q: "ما الفرق بين نافع وشراء عقار مباشرة؟", a: "في نافع تستثمر في حق المنفعة لا في ملكية العقار، مما يعني دخولاً بمبالغ أصغر، سيولة أعلى، وإدارة احترافية دون أي عناء." },
  { q: "ما الحد الأدنى للتملك؟", a: "يختلف حسب كل فرصة. بعض الفرص تبدأ من 3,000 ريال فقط. الحد الأدنى مذكور بوضوح في تفاصيل كل فرصة." },
  { q: "متى أستلم دخلي الإيجاري؟", a: "وفق جدول التوزيع المحدد لكل فرصة (شهري / ربع سنوي / نصف سنوي / سنوي). يُضاف الدخل الإيجاري مباشرة لمحفظتك داخل المنصة." },
  { q: "هل يمكنني سحب أموالي في أي وقت؟", a: "رصيد محفظتك متاح للسحب في أي وقت. أما وحدات المنفعة فهي مرتبطة بمدة العقد المحددة لكل فرصة." },
  { q: "كيف تُحقق نافع الأرباح؟", a: "نافع تأخذ رسوم إدارة بسيطة من الدخل الإيجاري المتحقق. لا رسوم خفية ولا عمولات دخول." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1a1a1a] font-[family-name:var(--font-tajawal)]" dir="rtl">

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <img src="/logo.svg" alt="نافع" className="h-9 w-auto" />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="#how" className="hover:text-[#2d7b33] transition-colors">رحلة العميل</a>
          <a href="#model" className="hover:text-[#2d7b33] transition-colors">نموذج العمل</a>
          <a href="#opportunities" className="hover:text-[#2d7b33] transition-colors">الفرص</a>
          <a href="#faq" className="hover:text-[#2d7b33] transition-colors">الأسئلة الشائعة</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-[#2d7b33] font-semibold text-sm px-4 py-2 rounded-full hover:bg-[#e8f5e9] transition-colors">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="bg-[#2d7b33] text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#1f5a24] transition-colors shadow-sm shadow-[#2d7b33]/30">
            ابدأ الآن
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f0faf1] via-white to-[#f0faf1] px-6 pt-20 pb-28 text-center">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2d7b33]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2d7b33]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-[#e8f5e9] text-[#2d7b33] text-sm font-semibold px-5 py-2 rounded-full mb-6 border border-[#2d7b33]/10">
            🇸🇦 منصة تملك حقوق المنفعة العقارية في السعودية
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1a1a1a] leading-tight mb-6">
            تملّك حقوق
            <br />
            <span className="text-[#2d7b33]">المنفعة العقارية</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            حقّق دخلاً إيجارياً منتظماً دون أن تمتلك عقاراً.
            ابدأ بـ 3,000 ريال فقط، واستلم توزيعاتك شهرياً.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-[#2d7b33] text-white text-base font-bold px-10 py-4 rounded-full hover:bg-[#1f5a24] transition-colors shadow-xl shadow-[#2d7b33]/20">
              ابدأ التملك مجاناً
            </Link>
            <a href="#opportunities" className="border-2 border-[#2d7b33] text-[#2d7b33] text-base font-bold px-10 py-4 rounded-full hover:bg-[#e8f5e9] transition-colors">
              استعرض الفرص ←
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-[#2d7b33] py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center text-white">
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="text-sm opacity-70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── رحلة العميل ── */}
      <section id="how" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#2d7b33] text-sm font-semibold bg-[#e8f5e9] px-4 py-1.5 rounded-full">رحلة العميل</span>
            <h2 className="text-4xl font-extrabold text-[#1a1a1a] mt-4 mb-3">كيف تتملك في نافع؟</h2>
            <p className="text-gray-400 max-w-md mx-auto">6 خطوات بسيطة تفصلك عن دخلك الإيجاري الأول</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <div key={step.num} className="relative bg-white border border-gray-100 rounded-3xl p-7 hover:border-[#2d7b33]/30 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl">{step.icon}</span>
                  <span className="text-5xl font-extrabold text-gray-100">{step.num}</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#1a1a1a] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-[#2d7b33] text-xl z-10">
                    {(i + 1) % 3 !== 0 ? "←" : ""}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/register" className="inline-block bg-[#2d7b33] text-white font-bold px-10 py-4 rounded-full hover:bg-[#1f5a24] transition-colors">
              ابدأ رحلتك الآن
            </Link>
          </div>
        </div>
      </section>

      {/* ── نموذج العمل ── */}
      <section id="model" className="py-24 px-6 bg-[#f9fafb]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#2d7b33] text-sm font-semibold bg-[#e8f5e9] px-4 py-1.5 rounded-full">نموذج العمل</span>
            <h2 className="text-4xl font-extrabold text-[#1a1a1a] mt-4 mb-3">كيف تعمل نافع؟</h2>
            <p className="text-gray-400 max-w-md mx-auto">نموذج شفاف قائم على حقوق المنفعة العقارية</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {modelItems.map((item) => (
              <div key={item.title} className="bg-white rounded-3xl p-7 border border-gray-100 hover:shadow-md transition-shadow flex gap-5">
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className={`text-base font-extrabold ${item.textColor} mb-2`}>{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Flow Diagram */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8">
            <h3 className="font-extrabold text-[#1a1a1a] text-center mb-8">كيف تتدفق الأموال</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {[
                { label: "المالك", sub: "يشحن محفظته", icon: "👤", color: "bg-[#e8f5e9] border-[#2d7b33]/20" },
                { arrow: true },
                { label: "نافع", sub: "تُدير العمليات", icon: "🏢", color: "bg-[#2d7b33] text-white" },
                { arrow: true },
                { label: "العقار", sub: "يُدرّ إيرادات", icon: "🏗️", color: "bg-orange-50 border-orange-200" },
                { arrow: true },
                { label: "المالك", sub: "يستلم دخله الإيجاري", icon: "💸", color: "bg-[#e8f5e9] border-[#2d7b33]/20" },
              ].map((item, i) =>
                'arrow' in item ? (
                  <div key={i} className="text-[#2d7b33] text-2xl hidden md:block">←</div>
                ) : (
                  <div key={i} className={`flex flex-col items-center justify-center w-32 h-32 rounded-2xl border ${item.color} text-center p-3`}>
                    <span className="text-3xl mb-1">{item.icon}</span>
                    <p className={`text-sm font-extrabold ${item.color.includes('#2d7b33') && !item.color.includes('e8f5e9') ? 'text-white' : 'text-[#1a1a1a]'}`}>{item.label}</p>
                    <p className={`text-xs mt-0.5 ${item.color.includes('#2d7b33') && !item.color.includes('e8f5e9') ? 'text-white/70' : 'text-gray-400'}`}>{item.sub}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── الفرص ── */}
      <section id="opportunities" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#2d7b33] text-sm font-semibold bg-[#e8f5e9] px-4 py-1.5 rounded-full">الفرص العقارية</span>
            <h2 className="text-4xl font-extrabold text-[#1a1a1a] mt-4 mb-3">فرص مختارة بعناية</h2>
            <p className="text-gray-400 max-w-md mx-auto">كل فرصة تمر بتقييم دقيق من فريق نافع قبل طرحها للملاك</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {opportunities.map((opp) => (
              <div key={opp.title} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                {/* Image */}
                <div className={`h-44 bg-gradient-to-br ${opp.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(0deg,white 0,white 1px,transparent 0,transparent 30px),repeating-linear-gradient(90deg,white 0,white 1px,transparent 0,transparent 30px)" }} />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">{opp.type}</span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-[#e8f5e9] text-[#2d7b33] text-xs font-bold px-3 py-1 rounded-full">مفتوحة</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                      <rect x="20" y="15" width="40" height="55" rx="2" fill="white"/>
                      <rect x="26" y="22" width="8" height="8" fill="white" fillOpacity="0.5"/>
                      <rect x="38" y="22" width="8" height="8" fill="white" fillOpacity="0.5"/>
                      <rect x="26" y="34" width="8" height="8" fill="white" fillOpacity="0.5"/>
                      <rect x="38" y="34" width="8" height="8" fill="white" fillOpacity="0.5"/>
                      <rect x="32" y="55" width="16" height="15" fill="white" fillOpacity="0.5"/>
                    </svg>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-extrabold text-[#1a1a1a] text-base mb-0.5">{opp.title}</h3>
                  <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {opp.location}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-50 mb-4">
                    <div className="text-center">
                      <p className="text-[#2d7b33] font-extrabold text-lg">{opp.return}</p>
                      <p className="text-xs text-gray-400">الدخل الإيجاري</p>
                    </div>
                    <div className="text-center border-x border-gray-50">
                      <p className="font-bold text-[#1a1a1a] text-sm">{opp.duration}</p>
                      <p className="text-xs text-gray-400">المدة</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-[#1a1a1a] text-sm">{opp.distribution}</p>
                      <p className="text-xs text-gray-400">التوزيع</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>نسبة التمويل</span>
                      <span className="font-semibold text-[#2d7b33]">{opp.funded}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-1.5">
                      <div className="bg-[#2d7b33] h-1.5 rounded-full" style={{ width: `${opp.funded}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">الحد الأدنى</p>
                      <p className="font-extrabold text-[#1a1a1a]">{opp.minInvest} ريال</p>
                    </div>
                    <Link href="/register" className="bg-[#2d7b33] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#1f5a24] transition-colors">
                      تملّك الآن
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/register" className="inline-block border-2 border-[#2d7b33] text-[#2d7b33] font-bold px-8 py-3.5 rounded-full hover:bg-[#e8f5e9] transition-colors">
              عرض جميع الفرص
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 bg-[#f9fafb]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#2d7b33] text-sm font-semibold bg-[#e8f5e9] px-4 py-1.5 rounded-full">الأسئلة الشائعة</span>
            <h2 className="text-4xl font-extrabold text-[#1a1a1a] mt-4 mb-3">أسئلة يسألها الملاك</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#2d7b33]/20 transition-colors">
                <h3 className="font-bold text-[#1a1a1a] text-base mb-2 flex items-start gap-2">
                  <span className="text-[#2d7b33] mt-0.5 flex-shrink-0">؟</span>
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mr-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-[#2d7b33] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="relative max-w-2xl mx-auto text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4">جاهز تبدأ تملكك؟</h2>
          <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
            انضم لأكثر من 1,200 مالك يحققون دخلاً إيجارياً منتظماً عبر نافع
          </p>
          <Link href="/register" className="inline-block bg-white text-[#2d7b33] font-extrabold text-lg px-12 py-4 rounded-full hover:bg-[#e8f5e9] transition-colors shadow-xl">
            ابدأ الآن مجاناً
          </Link>
          <p className="text-white/50 text-sm mt-4">لا رسوم تسجيل · تحقق فوري عبر نفاذ</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#1a1a1a] text-white px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <img src="/logo.svg" alt="نافع" className="h-10 w-auto brightness-0 invert mb-3" />
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                منصة نافع لتملك حقوق المنفعة العقارية. مرخصة ومنظمة وفق متطلبات هيئة العقار السعودية.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm text-gray-400">
              <a href="#how" className="hover:text-white transition-colors">رحلة العميل</a>
              <Link href="/login" className="hover:text-white transition-colors">تسجيل الدخول</Link>
              <a href="#model" className="hover:text-white transition-colors">نموذج العمل</a>
              <Link href="/register" className="hover:text-white transition-colors">إنشاء حساب</Link>
              <a href="#opportunities" className="hover:text-white transition-colors">الفرص</a>
              <Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link>
              <a href="#faq" className="hover:text-white transition-colors">الأسئلة الشائعة</a>
              <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>© 2025 نافع. جميع الحقوق محفوظة</p>
            <p>تملك حقوق المنفعة العقارية ينطوي على مخاطر. يُرجى قراءة نشرة المخاطر قبل التملك.</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
