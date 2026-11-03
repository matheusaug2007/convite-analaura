-- Configurações do site (tema de cores e chave PIX do convite).
-- Script idempotente (pode ser rodado mais de uma vez sem erro).
create table if not exists public.site_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.site_settings enable row level security;

drop policy if exists "Leitura publica das configuracoes" on public.site_settings;
create policy "Leitura publica das configuracoes"
on public.site_settings for select
to anon, authenticated
using (true);

drop policy if exists "Admin cria configuracoes" on public.site_settings;
create policy "Admin cria configuracoes"
on public.site_settings for insert
to authenticated
with check (true);

drop policy if exists "Admin atualiza configuracoes" on public.site_settings;
create policy "Admin atualiza configuracoes"
on public.site_settings for update
to authenticated
using (true)
with check (true);
