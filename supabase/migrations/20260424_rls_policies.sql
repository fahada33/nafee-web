-- Enable RLS
alter table users               enable row level security;
alter table investments         enable row level security;
alter table wallet_transactions enable row level security;
alter table opportunities       enable row level security;

-- opportunities: anyone can read (public listings)
create policy "opportunities_public_read"
  on opportunities for select using (true);

-- users: each user can read/update only their own row
create policy "users_own_read"
  on users for select using (auth.uid()::text = id::text);

create policy "users_own_update"
  on users for update using (auth.uid()::text = id::text);

-- investments: users see only their own
create policy "investments_own_read"
  on investments for select using (auth.uid()::text = user_id::text);

create policy "investments_own_insert"
  on investments for insert with check (auth.uid()::text = user_id::text);

-- wallet_transactions: users see only their own
create policy "wallet_tx_own_read"
  on wallet_transactions for select using (auth.uid()::text = user_id::text);

create policy "wallet_tx_own_insert"
  on wallet_transactions for insert with check (auth.uid()::text = user_id::text);
