create table public.investments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  shares_count integer not null default 1,
  amount numeric not null,
  status text default 'active' check (status in ('active', 'pending', 'exited')),
  created_at timestamptz default now()
);

create index on public.investments(user_id);
create index on public.investments(opportunity_id);

alter table public.investments enable row level security;
create policy "Allow all" on public.investments for all using (true) with check (true);
