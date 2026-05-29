-- ============================================================
--  Tabla "settings" para datos editables desde el Panel de Control
--  (datos bancarios para transferencia, etc.)
--
--  CÓMO USAR:
--  1. Entra a tu proyecto en https://supabase.com
--  2. Menú lateral → "SQL Editor" → "New query"
--  3. Pega TODO este archivo y dale a "Run"
--  Solo necesitas hacer esto UNA vez.
-- ============================================================

create table if not exists public.settings (
  id              text primary key,
  bank_name       text,
  account_holder  text,
  clabe           text,
  account_number  text,
  card_number     text,
  instructions    text,
  updated_at      timestamptz default now()
);

-- Fila inicial vacía (los datos se rellenan desde el panel "Ajustes")
insert into public.settings (id) values ('bank')
on conflict (id) do nothing;

-- ── Permisos (RLS) ──────────────────────────────────────────
-- La tienda y el panel usan la "anon key", así que permitimos
-- lectura pública y escritura con esa clave (igual que el resto
-- de tus tablas).
alter table public.settings enable row level security;

drop policy if exists "settings_select" on public.settings;
create policy "settings_select" on public.settings
  for select using (true);

drop policy if exists "settings_insert" on public.settings;
create policy "settings_insert" on public.settings
  for insert with check (true);

drop policy if exists "settings_update" on public.settings;
create policy "settings_update" on public.settings
  for update using (true) with check (true);
