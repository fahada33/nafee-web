import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: Request) {
  try {
    const { phone, reason } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const db = supabaseAdmin();

    const { data: user, error: userErr } = await db
      .from('users')
      .select('id, wallet_balance')
      .eq('phone', phone)
      .single();
    if (userErr || !user) {
      return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
    }

    const { count: activeCount } = await db
      .from('investments')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'active');

    if ((activeCount ?? 0) > 0) {
      return NextResponse.json(
        {
          error: 'has_active_contracts',
          message:
            'لا يمكن حذف الحساب بوجود عقود نشطة. يرجى التواصل مع الدعم لتسوية العقود.',
        },
        { status: 409 },
      );
    }

    if ((user.wallet_balance ?? 0) > 0) {
      return NextResponse.json(
        {
          error: 'positive_balance',
          message:
            'محفظتك تحتوي على رصيد. يرجى سحب الرصيد أولاً قبل حذف الحساب.',
          balance: user.wallet_balance,
        },
        { status: 409 },
      );
    }

    await db
      .from('users')
      .update({
        status: 'deleted',
        full_name: null,
        national_id: null,
        phone: `deleted_${user.id}`,
        deletion_reason: reason ?? null,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return NextResponse.json({ error: 'server_error', detail: msg }, { status: 500 });
  }
}
