-- Lista de Presentes & Registro de Mimos via PIX
-- Script idempotente (pode ser rodado no SQL Editor do Supabase sem erro de duplicidade).

-- 1. Catálogo de Presentes da Debutante
create table if not exists public.gift_items (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    price numeric(10, 2) not null check (price >= 0),
    emoji text default '🎁' not null,
    image_url text,
    is_active boolean default true not null,
    sort_order integer default 0 not null
);

-- 2. Registro de Presentes / PIX enviados pelos convidados
create table if not exists public.gift_contributions (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    gift_id uuid references public.gift_items(id) on delete set null,
    gift_title text not null,
    amount numeric(10, 2) not null check (amount >= 0),
    giver_name text not null,
    message text
);

alter table public.gift_items enable row level security;
alter table public.gift_contributions enable row level security;

-- Políticas de acesso (com drop if exists para evitar erro 42710)
drop policy if exists "Leitura publica de presentes" on public.gift_items;
create policy "Leitura publica de presentes"
on public.gift_items for select
to anon, authenticated
using (true);

drop policy if exists "Admin insere presentes" on public.gift_items;
create policy "Admin insere presentes"
on public.gift_items for insert
to authenticated
with check (true);

drop policy if exists "Admin atualiza presentes" on public.gift_items;
create policy "Admin atualiza presentes"
on public.gift_items for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin remove presentes" on public.gift_items;
create policy "Admin remove presentes"
on public.gift_items for delete
to authenticated
using (true);

drop policy if exists "Convidados registram envio de presente PIX" on public.gift_contributions;
create policy "Convidados registram envio de presente PIX"
on public.gift_contributions for insert
to anon, authenticated
with check (true);

drop policy if exists "Admin le presentes recebidos" on public.gift_contributions;
create policy "Admin le presentes recebidos"
on public.gift_contributions for select
to authenticated
using (true);

drop policy if exists "Admin remove registro de presente recebido" on public.gift_contributions;
create policy "Admin remove registro de presente recebido"
on public.gift_contributions for delete
to authenticated
using (true);

-- Insere as sugestões iniciais apenas se a tabela estiver vazia
insert into public.gift_items (title, description, price, emoji, sort_order)
select * from (values
  ('Dia de Spa & Salão de Beleza', 'Para relaxar e brilhar ainda mais no grande dia', 120.00, '💆‍♀️', 1),
  ('Bolsa Tiracolo de Festa', 'Um acessório especial para guardar recordações', 150.00, '👜', 2),
  ('Perfume Floral Importado', 'Fragrância doce e inesquecível como os 15 anos', 180.00, '🌸', 3),
  ('Cota para Viagem dos Sonhos', 'Ajude a realizar uma viagem inesquecível', 250.00, '✈️', 4),
  ('Ensaio Fotográfico Extra', 'Mais cliques para eternizar essa fase mágica', 200.00, '📸', 5),
  ('Mimo Carinhoso', 'Um presente especial para a debutante', 80.00, '💝', 6)
) as v(title, description, price, emoji, sort_order)
where not exists (select 1 from public.gift_items limit 1);
