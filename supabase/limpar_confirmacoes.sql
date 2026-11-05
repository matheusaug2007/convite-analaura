-- Zera SOMENTE as confirmações de presença (RSVP).
-- Não mexe em: chave PIX, cores/tema, presentes, usuário do admin nem em nenhuma outra tabela.
-- Rode no Supabase: SQL Editor > New query > cole e clique em Run.

-- 1) Conferir o que será apagado (opcional)
select guest_name, status, number_of_companions, created_at
from public.rsvp_guests
order by created_at;

-- 2) Apagar todas as confirmações
delete from public.rsvp_guests;

-- 3) Conferir que ficou zerado (deve retornar 0)
select count(*) as confirmacoes_restantes from public.rsvp_guests;
