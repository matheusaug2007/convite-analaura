# Arquitetura de Dados & Backend (Supabase + Netlify)

## 1. Por que Supabase?
- **Grátis e escalável:** Perfeito para eventos únicos e portfólios no Netlify.
- **Banco PostgreSQL real:** Permite integridade referencial, consultas fáceis e segurança com RLS (Row Level Security).
- **Sem servidor backend complexo:** O frontend se comunica diretamente com a API do Supabase via chave pública anônima (`supabaseKey`).
- **Dashboard simples:** A aniversariante e os pais podem acessar o painel do Supabase ou você pode exportar um Excel/CSV das confirmações com 1 clique.

---

## 2. Modelo Relacional de Dados (SQL Schema)

Copie e execute o script abaixo no **SQL Editor** do painel do Supabase:

```sql
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

-- Políticas de Acesso: Qualquer visitante com o link pode enviar confirmação e ler recados aprovados
create policy "Permitir inserção pública de RSVP"
on public.rsvp_guests for insert
with check (true);

create policy "Permitir inserção pública de recados"
on public.guestbook_messages for insert
with check (true);

create policy "Permitir leitura pública de recados aprovados"
on public.guestbook_messages for select
using (is_approved = true);
```

---

## 3. Variáveis de Ambiente no Netlify
No painel do Netlify (**Site configuration > Environment variables**), adicione:
- `VITE_SUPABASE_URL` = `https://seu-projeto.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `sua-chave-anon-publica`

---

## 4. Endpoints & Funções Frontend (SDK do Supabase)
Exemplo de chamada para salvar a confirmação:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function submitRsvp(payload) {
  const { data, error } = await supabase
    .from('rsvp_guests')
    .insert([payload])
  
  if (error) throw error
  return data
}
```