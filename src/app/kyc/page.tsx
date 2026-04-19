"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const totalSteps = 7;

const employmentOptions = ["موظف حكومي", "موظف قطاع خاص", "أعمال حرة", "متقاعد", "طالب", "غير ذلك"];
const sectorOptions = ["المالية والمصرفية", "التقنية", "الصحة", "التعليم", "العقارات", "التجزئة", "الطاقة", "غير ذلك"];
const incomeOptions = ["أقل من 5,000 ريال", "5,000 - 15,000 ريال", "15,000 - 30,000 ريال", "30,000 - 50,000 ريال", "أكثر من 50,000 ريال"];
const experienceOptions = ["لا توجد خبرة", "أقل من سنة", "1-3 سنوات", "3-5 سنوات", "أكثر من 5 سنوات"];
const investmentSizeOptions = ["أقل من 10,000 ريال", "10,000 - 50,000 ريال", "50,000 - 200,000 ريال", "أكثر من 200,000 ريال"];
const horizonOptions = ["أقل من سنة", "1-3 سنوات", "3-5 سنوات", "أكثر من 5 سنوات"];
const investmentTypeOptions = ["أسهم", "صناديق استثمارية", "عقارات", "سندات / صكوك", "ودائع بنكية", "لا يوجد"];

export default function KYCPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [employment, setEmployment] = useState("");
  const [sector, setSector] = useState("");
  const [income, setIncome] = useState("");
  const [isPEP, setIsPEP] = useState<boolean | null>(null);
  const [experience, setExperience] = useState("");
  const [investmentSize, setInvestmentSize] = useState("");
  const [horizon, setHorizon] = useState("");
  const [investmentTypes, setInvestmentTypes] = useState<string[]>([]);

  const toggleType = (type: string) => {
    setInvestmentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else router.push("/kyc/success");
  };

  const progress = Math.round((step / totalSteps) * 100);

  const canProceed = () => {
    if (step === 1) return !!employment;
    if (step === 2) return !!sector;
    if (step === 3) return !!income;
    if (step === 4) return isPEP !== null;
    if (step === 5) return !!experience;
    if (step === 6) return !!investmentSize && !!horizon;
    if (step === 7) return investmentTypes.length > 0;
    return false;
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4 font-[family-name:var(--font-tajawal)]">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-md px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">{step} / {totalSteps}</span>
          <img src="/logo.svg" alt="نافع" className="h-8 w-auto" />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
          <div
            className="bg-[#2d7b33] h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step 1: Employment */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">الحالة الوظيفية</h2>
            <p className="text-gray-400 text-sm mb-3">ما هي حالتك الوظيفية الحالية؟</p>
            <div className="grid grid-cols-2 gap-3">
              {employmentOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setEmployment(opt)}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors
                    ${employment === opt ? "border-[#2d7b33] bg-[#e8f5e9] text-[#2d7b33]" : "border-gray-200 text-gray-600 hover:border-[#2d7b33]"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Sector */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">القطاع</h2>
            <p className="text-gray-400 text-sm mb-3">في أي قطاع تعمل؟</p>
            <div className="grid grid-cols-2 gap-3">
              {sectorOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSector(opt)}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors
                    ${sector === opt ? "border-[#2d7b33] bg-[#e8f5e9] text-[#2d7b33]" : "border-gray-200 text-gray-600 hover:border-[#2d7b33]"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Income */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">الدخل السنوي</h2>
            <p className="text-gray-400 text-sm mb-3">ما هو دخلك السنوي التقريبي؟</p>
            <div className="flex flex-col gap-3">
              {incomeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setIncome(opt)}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors text-right
                    ${income === opt ? "border-[#2d7b33] bg-[#e8f5e9] text-[#2d7b33]" : "border-gray-200 text-gray-600 hover:border-[#2d7b33]"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: PEP */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">الشخص السياسي المعرّض</h2>
            <p className="text-gray-400 text-sm mb-3">
              هل أنت أو أي من أفراد عائلتك المقربين شخص سياسي معرّض (PEP)؟
            </p>
            <div className="flex flex-col gap-3">
              {[{ label: "نعم", value: true }, { label: "لا", value: false }].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => setIsPEP(value)}
                  className={`py-4 px-4 rounded-xl border text-base font-bold transition-colors
                    ${isPEP === value ? "border-[#2d7b33] bg-[#e8f5e9] text-[#2d7b33]" : "border-gray-200 text-gray-600 hover:border-[#2d7b33]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Experience */}
        {step === 5 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">خبرة الاستثمار</h2>
            <p className="text-gray-400 text-sm mb-3">كم سنة خبرتك في الاستثمار؟</p>
            <div className="flex flex-col gap-3">
              {experienceOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setExperience(opt)}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors text-right
                    ${experience === opt ? "border-[#2d7b33] bg-[#e8f5e9] text-[#2d7b33]" : "border-gray-200 text-gray-600 hover:border-[#2d7b33]"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Size + Horizon */}
        {step === 6 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">حجم الاستثمار المتوقع</h2>
              <p className="text-gray-400 text-sm mb-3">كم تتوقع استثمارك الإجمالي في المنصة؟</p>
              <div className="flex flex-col gap-3">
                {investmentSizeOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setInvestmentSize(opt)}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors text-right
                      ${investmentSize === opt ? "border-[#2d7b33] bg-[#e8f5e9] text-[#2d7b33]" : "border-gray-200 text-gray-600 hover:border-[#2d7b33]"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1a] mb-1">الأفق الزمني للاستثمار</h2>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {horizonOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setHorizon(opt)}
                    className={`py-3 px-2 rounded-xl border text-sm font-medium transition-colors
                      ${horizon === opt ? "border-[#2d7b33] bg-[#e8f5e9] text-[#2d7b33]" : "border-gray-200 text-gray-600 hover:border-[#2d7b33]"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Investment Types */}
        {step === 7 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">أنواع الاستثمارات</h2>
            <p className="text-gray-400 text-sm mb-3">ما هي أنواع الاستثمارات التي تمتلكها حالياً؟ (يمكن اختيار أكثر من واحد)</p>
            <div className="grid grid-cols-2 gap-3">
              {investmentTypeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleType(opt)}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors
                    ${investmentTypes.includes(opt) ? "border-[#2d7b33] bg-[#e8f5e9] text-[#2d7b33]" : "border-gray-200 text-gray-600 hover:border-[#2d7b33]"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full bg-[#2d7b33] text-white font-bold py-4 rounded-xl hover:bg-[#1f5a24] transition-colors mt-8 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step === totalSteps ? "إكمال التسجيل" : "التالي"}
        </button>

        {/* Back */}
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full text-gray-400 text-sm text-center mt-3 hover:text-[#2d7b33] transition-colors"
          >
            → رجوع
          </button>
        )}
      </div>
    </main>
  );
}
