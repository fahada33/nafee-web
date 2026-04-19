create table public.opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  location text not null,
  type text not null,
  status text default 'active' check (status in ('active', 'funding', 'completed')),
  return_percent numeric not null,
  duration_years integer not null,
  image_url text,
  funded_percent numeric default 0,
  investors_count integer default 0,
  share_amount numeric not null,
  monthly_income numeric not null,
  total_value numeric not null,
  featured boolean default false,
  created_at timestamptz default now()
);

alter table public.opportunities enable row level security;
create policy "Allow all" on public.opportunities for all using (true) with check (true);
