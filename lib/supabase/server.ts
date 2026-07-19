import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserRole } from '@/types/database';

export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — middleware handles refresh.
          }
        },
      },
    }
  );
}

// Backwards-compatible alias (some pages import createServerClient).
export const createServerClient = createClient;

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getProfile();
  return (profile?.role as UserRole) ?? null;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const role = await getUserRole();
  if (!role || !allowedRoles.includes(role)) {
    return { authorized: false, role: null };
  }
  return { authorized: true, role };
}

export async function requireClient() {
  return requireRole(['client']);
}

export async function requireTalent() {
  return requireRole(['talent']);
}

export async function requireAdmin() {
  return requireRole(['admin']);
}
