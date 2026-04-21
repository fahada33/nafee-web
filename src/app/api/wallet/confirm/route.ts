import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const MOYASAR_API = 'https://api.moyasar.com/v1/payments';

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: Request) {
  try {
    const { payment_id, phone, amount } = await req.json();
    if (!payment_id || !phone || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const secretKey = process.env.MOYASAR_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: 'server_not_configured' }, { status: 500 });
    }

    // Verify with Moyasar using HTTP Basic (secret_key:)
    const auth = Buffer.from(`${secretKey.trim()}:`).toString('base64');
    const verifyRes = await fetch(`${MOYASAR_API}/${payment_id}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!verifyRes.ok) {
      const body = await verifyRes.text();
      return NextResponse.json(
        {
          error: 'moyasar_lookup_failed',
          status: verifyRes.status,
          detail: body.substring(0, 400),
        },
        { status: verifyRes.status === 401 ? 401 : 404 },
      );
    }
    const payment = await verifyRes.json();

    if (payment.status !== 'paid') {
      return NextResponse.json(
        { error: 'payment_not_paid', status: payment.status },
        { status: 402 },
      );
    }

    const paidAmountRiyals = Math.round(payment.amount) / 100;
    if (Math.abs(paidAmountRiyals - amount) > 0.01) {
      return NextResponse.json(
        { error: 'amount_mismatch', paid: paidAmountRiyals, expected: amount },
        { status: 400 },
      );
    }

    const db = supabaseAdmin();

    // Idempotency: skip if we already logged this payment_id
    const { data: existing } = await db
      .from('wallet_transactions')
      .select('id')
      .eq('reference', `moyasar:${payment_id}`)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ ok: true, deduped: true });
    }

    const { data: user, error: userErr } = await db
      .from('users')
      .select('id, wallet_balance')
      .eq('phone', phone)
      .single();
    if (userErr || !user) {
      return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
    }

    const { error: txErr } = await db.from('wallet_transactions').insert({
      user_id: user.id,
      amount: paidAmountRiyals,
      type: 'deposit',
      status: 'completed',
      reference: `moyasar:${payment_id}`,
    });
    if (txErr) {
      return NextResponse.json({ error: 'insert_failed', detail: txErr.message }, { status: 500 });
    }

    const newBalance = Number(user.wallet_balance ?? 0) + paidAmountRiyals;
    await db.from('users').update({ wallet_balance: newBalance }).eq('id', user.id);

    return NextResponse.json({ ok: true, balance: newBalance });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return NextResponse.json({ error: 'server_error', detail: msg }, { status: 500 });
  }
}
