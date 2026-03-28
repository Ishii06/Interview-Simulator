create table if not exists public.interview_history (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  role text not null,
  experience text not null,
  skills text[] not null default '{}',
  difficulty text not null,
  question text not null,
  answer text not null,
  answer_source text not null default 'voice',
  created_at timestamptz not null default now()
);

create index if not exists interview_history_user_created_idx
  on public.interview_history (user_id, created_at);

alter table public.interview_history enable row level security;

create policy if not exists "service role can manage interview history"
on public.interview_history
as permissive
for all
to service_role
using (true)
with check (true);
