-- Painel administrativo: acesso restrito a usuários AUTENTICADOS (Supabase Auth).
-- Rode no SQL Editor do Supabase depois do schema.sql.
-- Antes: Authentication > Users > "Add user" (e-mail + senha) para a família.

create policy "Admin le todos os RSVPs"
on public.rsvp_guests for select
to authenticated
using (true);

create policy "Admin le todos os recados"
on public.guestbook_messages for select
to authenticated
using (true);

create policy "Admin modera recados"
on public.guestbook_messages for update
to authenticated
using (true)
with check (true);

-- Atualizações em tempo real (as policies acima continuam valendo)
alter publication supabase_realtime add table public.rsvp_guests;
alter publication supabase_realtime add table public.guestbook_messages;

