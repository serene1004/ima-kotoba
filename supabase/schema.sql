create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  emotion_label text not null check (emotion_label in ('기쁨', '평온', '보통', '피곤', '슬픔', '눈물')),
  japanese text not null check (char_length(japanese) between 1 and 150),
  korean text check (korean is null or char_length(korean) <= 150),
  created_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;

create policy "Users can read their own journal entries"
on public.journal_entries for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own journal entries"
on public.journal_entries for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own journal entries"
on public.journal_entries for delete to authenticated
using ((select auth.uid()) = user_id);
