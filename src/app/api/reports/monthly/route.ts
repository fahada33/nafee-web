import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

function monthBounds(year: number, monthIdx0: number) {
  const start = new Date(Date.UTC(year, monthIdx0, 1));
  const end = new Date(Date.UTC(year, monthIdx0 + 1, 1));
  return { start: start.toISOString(), end: end.toISOString() };
}

/**
 * GET /api/reports/monthly?phone=5XXXXXXXX&year=2026&month=4
 * Returns an Arabic HTML report the user can view or print to PDF.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const phone = url.searchParams.get("phone");
  const year = Number(url.searchParams.get("year") || new Date().getFullYear());
  const month = Number(url.searchParams.get("month") || new Date().getMonth() + 1);
  if (!phone) {
    return NextResponse.json({ error: "phone_required" }, { status: 400 });
  }
  const d = db();

  const { data: user } = await d
    .from("users")
    .select("id, full_name, phone")
    .eq("phone", phone)
    .maybeSingle();
  if (!user) {
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }

  const { start, end } = monthBounds(year, month - 1);

  const [{ data: txs }, { data: invs }] = await Promise.all([
    d
      .from("wallet_transactions")
      .select("amount, type, reference, created_at")
      .eq("user_id", user.id)
      .gte("created_at", start)
      .lt("created_at", end)
      .order("created_at", { ascending: true }),
    d
      .from("investments")
      .select("amount, shares_count, created_at, opportunities(title, return_percent)")
      .eq("user_id", user.id),
  ]);

  const deposits = (txs ?? []).filter((t) => t.type === "deposit");
  const distributions = (txs ?? []).filter((t) => t.type === "return");
  const totalDeposit = deposits.reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalDist = distributions.reduce((s, t) => s + Number(t.amount || 0), 0);

  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>تقرير ${months[month - 1]} ${year} — نافع</title>
<style>
  @page { size: A4; margin: 18mm 14mm; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Tajawal', Arial, sans-serif; color: #1a1a1a; margin: 0; background: #fff; }
  .page { max-width: 780px; margin: 0 auto; padding: 20px; }
  .hdr { display: flex; justify-content: space-between; align-items: center; padding-bottom: 18px; border-bottom: 2px solid #2d7b33; }
  .logo { font-size: 24px; font-weight: 900; color: #2d7b33; }
  .hdr-title { text-align: left; color: #666; font-size: 13px; }
  h1 { font-size: 22px; margin: 24px 0 4px; }
  h2 { font-size: 15px; margin: 28px 0 10px; color: #2d7b33; }
  .meta { color: #888; font-size: 12px; margin-bottom: 18px; }
  .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 18px 0; }
  .kpi { background: #f6f9f6; border-radius: 14px; padding: 16px; text-align: center; }
  .kpi .v { font-size: 18px; font-weight: 900; color: #2d7b33; }
  .kpi .l { font-size: 11px; color: #666; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }
  th, td { padding: 9px 10px; border-bottom: 1px solid #eee; text-align: right; }
  th { background: #f9fafb; color: #666; font-weight: 700; font-size: 11px; }
  .pos { color: #2d7b33; font-weight: 700; }
  .neg { color: #b91c1c; font-weight: 700; }
  .footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #eee; color: #888; font-size: 10px; text-align: center; line-height: 1.8; }
  .empty { text-align: center; padding: 24px; color: #888; font-size: 12px; }
  .print-btn { position: fixed; top: 16px; left: 16px; background: #2d7b33; color: #fff; padding: 10px 16px; border-radius: 10px; border: 0; font-size: 13px; cursor: pointer; }
  @media print { .print-btn { display: none; } }
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()">🖨 طباعة / حفظ كـ PDF</button>
<div class="page">
  <div class="hdr">
    <div class="logo">نافع</div>
    <div class="hdr-title">
      تقرير شهري · ${months[month - 1]} ${year}
    </div>
  </div>

  <h1>مرحباً ${user.full_name ?? "—"}</h1>
  <div class="meta">هذا ملخّص نشاطك على منصة نافع خلال ${months[month - 1]} ${year}.</div>

  <div class="kpis">
    <div class="kpi">
      <div class="v">${fmt(Math.round(totalDeposit))} ريال</div>
      <div class="l">شحن المحفظة</div>
    </div>
    <div class="kpi">
      <div class="v">${fmt(Math.round(totalDist))} ريال</div>
      <div class="l">دخل إيجاري مستلم</div>
    </div>
    <div class="kpi">
      <div class="v">${(invs ?? []).length}</div>
      <div class="l">عقود نشطة</div>
    </div>
  </div>

  <h2>المعاملات خلال الشهر</h2>
  ${
    (txs ?? []).length === 0
      ? `<div class="empty">لا توجد معاملات خلال هذا الشهر</div>`
      : `<table>
    <thead><tr>
      <th>التاريخ</th>
      <th>النوع</th>
      <th>المبلغ</th>
    </tr></thead>
    <tbody>
      ${(txs ?? [])
        .map((t) => {
          const date = new Date(t.created_at as string).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" });
          const label =
            t.type === "deposit"
              ? "شحن"
              : t.type === "return"
                ? "دخل إيجاري"
                : t.type === "investment"
                  ? "تملك وحدة"
                  : t.type === "withdrawal"
                    ? "سحب"
                    : t.type;
          const cls = Number(t.amount) > 0 ? "pos" : "neg";
          const sign = Number(t.amount) > 0 ? "+" : "";
          return `<tr>
            <td>${date}</td>
            <td>${label}</td>
            <td class="${cls}">${sign}${fmt(Math.abs(Number(t.amount)))} ريال</td>
          </tr>`;
        })
        .join("")}
    </tbody>
  </table>`
  }

  <h2>عقودي</h2>
  ${
    (invs ?? []).length === 0
      ? `<div class="empty">لا توجد عقود حتى الآن</div>`
      : `<table>
    <thead><tr>
      <th>الفرصة</th>
      <th>عدد الوحدات</th>
      <th>مبلغ التملك</th>
      <th>الدخل الإيجاري</th>
    </tr></thead>
    <tbody>
      ${(invs ?? [])
        .map((i) => {
          const raw = (i as { opportunities?: unknown }).opportunities;
          const oppArr = Array.isArray(raw) ? raw : raw ? [raw] : [];
          const o = (oppArr[0] ?? {}) as { title?: string; return_percent?: number };
          return `<tr>
          <td>${o.title ?? "—"}</td>
          <td>${i.shares_count ?? 0}</td>
          <td>${fmt(Math.round(Number(i.amount ?? 0)))} ريال</td>
          <td class="pos">${o.return_percent ?? 0}%</td>
        </tr>`;
        })
        .join("")}
    </tbody>
  </table>`
  }

  <div class="footer">
    نافع منصة مرخّصة وفق متطلبات هيئة العقار السعودية<br>
    للاستفسار: support@nafee.net · +966 500 000 000<br>
    تم إنشاء هذا التقرير تلقائياً بناءً على بيانات حسابك. يُرجى مراجعته والتواصل مع الدعم عند وجود أي فروقات.
  </div>
</div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
