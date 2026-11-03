-- Script opcional para remover a tabela do Mural de Recados do Supabase
-- Execute no SQL Editor do Supabase se quiser limpar o banco:

drop policy if exists "Permitir inserção pública de recados" on public.guestbook_messages;
drop policy if exists "Permitir leitura pública de recados aprovados" on public.guestbook_messages;
drop policy if exists "Admin le todos os recados" on public.guestbook_messages;
drop policy if exists "Admin modera recados" on public.guestbook_messages;

drop table if exists public.guestbook_messages cascade;

