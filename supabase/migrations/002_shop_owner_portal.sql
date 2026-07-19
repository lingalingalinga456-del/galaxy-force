-- ============================================================================
-- Galaxy Workforce v7.3 — Shop Owner Portal
-- Migration 002: shop_profiles, products, orders, inventory + role enum update
-- ============================================================================

-- 1. Extend the existing user_role enum (profiles.role is already an enum column,
--    so we add the new value instead of re-adding a text column).
alter type user_role add value if not exists 'shop_owner';

-- 2. New tables ---------------------------------------------------------------

create table public.shop_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  shop_name text not null,
  business_type text not null,
  address text,
  city text,
  phone text,
  years_in_operation integer,
  delivery_radius_km integer default 10,
  min_order_amount numeric default 0,
  verification_status text default 'pending' check (verification_status in ('pending','verified','rejected')),
  trust_score integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references public.shop_profiles(id) on delete cascade not null,
  name text not null,
  description text,
  category text not null,
  price numeric not null check (price >= 0),
  stock_quantity integer default 0,
  delivery_days integer default 3,
  status text default 'draft' check (status in ('draft','published','paused','archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  storage_path text not null,
  is_cover boolean default false,
  created_at timestamptz default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references public.shop_profiles(id) on delete cascade not null,
  client_id uuid references public.profiles(id) not null,
  status text default 'pending' check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  total_amount numeric not null,
  delivery_address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null,
  unit_price numeric not null
);

create table public.inventory_logs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  change integer not null,
  reason text,
  created_at timestamptz default now()
);

-- 3. Indexes ------------------------------------------------------------------
create index idx_shop_profiles_user on shop_profiles(user_id);
create index idx_products_shop on products(shop_id);
create index idx_products_category on products(category);
create index idx_products_status on products(status);
create index idx_orders_shop on orders(shop_id);
create index idx_orders_client on orders(client_id);
create index idx_order_items_order on order_items(order_id);
create index idx_product_media_product on product_media(product_id);
create index idx_inventory_logs_product on inventory_logs(product_id);

-- 4. Updated-at trigger helper (reuse a generic trigger if present) ------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_shop_profiles_updated on shop_profiles;
create trigger trg_shop_profiles_updated before update on shop_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated before update on products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated before update on orders
  for each row execute function public.set_updated_at();

-- 5. Row Level Security --------------------------------------------------------
alter table public.shop_profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_logs enable row level security;

-- Shop profiles: owner manages own; published shops visible publicly
create policy "Shop profiles viewable by owner"
  on public.shop_profiles for select using (user_id = auth.uid());
create policy "Public verified shops viewable"
  on public.shop_profiles for select using (verification_status = 'verified');
create policy "Shop profiles manageable by owner"
  on public.shop_profiles for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Products: owner manages own; published products visible publicly
create policy "Products viewable by shop owner"
  on public.products for select using (
    exists (select 1 from shop_profiles where shop_profiles.id = products.shop_id and shop_profiles.user_id = auth.uid())
  );
create policy "Public published products viewable"
  on public.products for select using (status = 'published');
create policy "Products manageable by shop owner"
  on public.products for all using (
    exists (select 1 from shop_profiles where shop_profiles.id = products.shop_id and shop_profiles.user_id = auth.uid())
  ) with check (
    exists (select 1 from shop_profiles where shop_profiles.id = products.shop_id and shop_profiles.user_id = auth.uid())
  );

-- Product media
create policy "Product media viewable"
  on public.product_media for select using (
    exists (
      select 1 from products
      join shop_profiles on shop_profiles.id = products.shop_id
      where products.id = product_media.product_id
        and (products.status = 'published' or shop_profiles.user_id = auth.uid())
    )
  );
create policy "Product media manageable by shop owner"
  on public.product_media for all using (
    exists (
      select 1 from products
      join shop_profiles on shop_profiles.id = products.shop_id
      where products.id = product_media.product_id and shop_profiles.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from products
      join shop_profiles on shop_profiles.id = products.shop_id
      where products.id = product_media.product_id and shop_profiles.user_id = auth.uid()
    )
  );

-- Orders: shop owner sees own orders; client sees own orders
create policy "Orders viewable by shop owner"
  on public.orders for select using (
    exists (select 1 from shop_profiles where shop_profiles.id = orders.shop_id and shop_profiles.user_id = auth.uid())
  );
create policy "Orders viewable by client"
  on public.orders for select using (client_id = auth.uid());
create policy "Orders manageable by shop owner"
  on public.orders for all using (
    exists (select 1 from shop_profiles where shop_profiles.id = orders.shop_id and shop_profiles.user_id = auth.uid())
  ) with check (
    exists (select 1 from shop_profiles where shop_profiles.id = orders.shop_id and shop_profiles.user_id = auth.uid())
  );

-- Order items
create policy "Order items viewable by participants"
  on public.order_items for select using (
    exists (
      select 1 from orders
      join shop_profiles on shop_profiles.id = orders.shop_id
      where orders.id = order_items.order_id
        and (shop_profiles.user_id = auth.uid() or orders.client_id = auth.uid())
    )
  );
create policy "Order items manageable by shop owner"
  on public.order_items for all using (
    exists (
      select 1 from orders
      join shop_profiles on shop_profiles.id = orders.shop_id
      where orders.id = order_items.order_id and shop_profiles.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from orders
      join shop_profiles on shop_profiles.id = orders.shop_id
      where orders.id = order_items.order_id and shop_profiles.user_id = auth.uid()
    )
  );

-- Inventory logs
create policy "Inventory logs viewable by shop owner"
  on public.inventory_logs for select using (
    exists (
      select 1 from products
      join shop_profiles on shop_profiles.id = products.shop_id
      where products.id = inventory_logs.product_id and shop_profiles.user_id = auth.uid()
    )
  );
create policy "Inventory logs manageable by shop owner"
  on public.inventory_logs for all using (
    exists (
      select 1 from products
      join shop_profiles on shop_profiles.id = products.shop_id
      where products.id = inventory_logs.product_id and shop_profiles.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from products
      join shop_profiles on shop_profiles.id = products.shop_id
      where products.id = inventory_logs.product_id and shop_profiles.user_id = auth.uid()
    )
  );
