create table if not exists distribution_logs (
  id               uuid primary key default gen_random_uuid(),
  opportunity_id   uuid references opportunities(id) on delete cascade,
  opp_title        text not null,
  total_amount     numeric(14,2) not null default 0,
  investors        int not null default 0,
  actual_return    numeric(6,2) not null default 0,
  note             text,
  distributed_at   timestamptz not null default now()
);
