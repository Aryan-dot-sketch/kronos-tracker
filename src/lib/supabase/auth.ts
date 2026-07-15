import { supabase, isSupabaseConfigured } from './client';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
}

// Convert username to internal email format for Supabase Auth engine
export function usernameToEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  return `${clean}@kronos.app`;
}

export async function signUpWithUsername(params: { name: string; username: string; password: string }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase project is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel.');
  }

  const cleanUsername = params.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (cleanUsername.length < 3) {
    throw new Error('Username must be at least 3 alphanumeric characters (letters, numbers, underscores).');
  }

  if (params.password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // Check if username is already taken in profiles table
  const { data: existing } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', cleanUsername)
    .maybeSingle();

  if (existing) {
    throw new Error(`Username "${cleanUsername}" is already taken. Please choose another username.`);
  }

  const internalEmail = usernameToEmail(cleanUsername);

  const { data, error } = await supabase.auth.signUp({
    email: internalEmail,
    password: params.password,
    options: {
      data: {
        name: params.name.trim(),
        username: cleanUsername
      }
    }
  });

  if (error) throw new Error(error.message);

  return { user: data.user, username: cleanUsername, name: params.name };
}

export async function signInWithUsername(params: { username: string; password: string }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to environment.');
  }

  const cleanUsername = params.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  const internalEmail = usernameToEmail(cleanUsername);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: internalEmail,
    password: params.password
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Incorrect username or password. Please verify your credentials.');
    }
    throw new Error(error.message);
  }

  return { user: data.user, session: data.session };
}

export async function signOutUser() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
}
