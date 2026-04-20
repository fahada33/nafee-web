-- Wallet balance on users
ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_balance numeric DEFAULT 0;

-- Min shares per opportunity (admin sets this)
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS min_shares integer DEFAULT 1;

-- Wallet transactions log
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('deposit', 'investment', 'return', 'withdrawal')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  reference text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS wallet_transactions_user_id_idx ON public.wallet_transactions(user_id);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON public.wallet_transactions FOR ALL USING (true) WITH CHECK (true);
