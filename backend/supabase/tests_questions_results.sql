create table if not exists public.tests (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  role text not null,
  experience text not null,
  difficulty text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_submitted boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists tests_user_id_idx
  on public.tests (user_id);

create table if not exists public.questions (
  id bigint generated always as identity primary key,
  test_id bigint not null references public.tests(id) on delete cascade,
  section text not null,
  question text not null,
  options text[] not null,
  correct_answer text not null,
  difficulty text not null,
  created_at timestamptz not null default now()
);

create index if not exists questions_test_id_idx
  on public.questions (test_id);

create table if not exists public.results (
  id bigint generated always as identity primary key,
  test_id bigint not null references public.tests(id) on delete cascade,
  user_id uuid not null,
  score integer not null,
  total integer not null,
  percentage numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists results_user_id_idx
  on public.results (user_id);

create index if not exists results_test_id_idx
  on public.results (test_id);

alter table public.tests enable row level security;
alter table public.questions enable row level security;
alter table public.results enable row level security;

create policy if not exists "service role can manage tests"
on public.tests
as permissive
for all
to service_role
using (true)
with check (true);

create policy if not exists "service role can manage questions"
on public.questions
as permissive
for all
to service_role
using (true)
with check (true);

create policy if not exists "service role can manage results"
on public.results
as permissive
for all
to service_role
using (true)
with check (true);
