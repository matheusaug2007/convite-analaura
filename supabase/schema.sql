-- 1. Tabela de Convidados e Confirmação de Presença (RSVP)
create table public.rsvp_guests (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    guest_name text not null,
    phone text not null,
    status text not null check (status in ('confirmed', 'declined')),
    number_of_companions integer default 0 not null check (number_of_companions >= 0),
    companion_names text[],
    dietary_restrictions text,
    confirmed_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Tabela de Mural de Recados / Mensagens para a Ana Laura
create table public.guestbook_messages (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    author_name text not null,
    message text not null,
    is_approved boolean default true not null
);

-- 3. Habilitação de RLS (Segurança)
alter table public.rsvp_guests enable row level security;
alter table public.guestbook_messages enable row level security;

create policy "Permitir inserção pública de RSVP"
on public.rsvp_guests for insert
with check (true);

create policy "Permitir inserção pública de recados"
on public.guestbook_messages for insert
with check (true);

create policy "Permitir leitura pública de recados aprovados"
on public.guestbook_messages for select
using (is_approved = true);

