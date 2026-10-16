-- IHAN Volailles — schéma de base de données (PostgreSQL / Supabase)
-- À utiliser quand vous passerez du stockage navigateur à un vrai serveur.
-- Les champs reprennent exactement ceux des commandes enregistrées par le site.

create table products (
  id          text primary key,              -- entier, decoupe, evenement, oeufs
  name        text    not null,
  price       integer not null check (price >= 0),   -- FCFA
  active      boolean not null default true
);

create table stock (
  product_id  text primary key references products(id),
  quantity    integer not null default 0 check (quantity >= 0),
  alert_level integer not null default 10,   -- seuil d'alerte du dashboard
  updated_at  timestamptz not null default now()
);

create table orders (
  id            text primary key,            -- ex : IH-261010-001
  created_at    timestamptz not null default now(),
  status        text not null default 'Nouvelle'
                check (status in ('Nouvelle','Confirmée','En livraison','Livrée','Annulée')),
  total         integer not null,
  customer_name text not null,
  phone         text not null,
  commune       text not null,
  address       text not null,
  landmark      text,
  delivery_date date not null,
  delivery_slot text,
  payment       text,
  notes         text,
  geo_lat       numeric(9,6),
  geo_lng       numeric(9,6),
  restocked     boolean not null default false   -- stock remis après annulation
);

create table order_items (
  id         bigserial primary key,
  order_id   text not null references orders(id) on delete cascade,
  product_id text not null references products(id),
  qty        integer not null check (qty > 0),
  unit_price integer not null
);

create index orders_created_idx on orders (created_at desc);
create index orders_status_idx  on orders (status);
