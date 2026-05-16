// Loosen the @supabase/supabase-js createClient return type so that the
// scaffolded email-queue route (which uses `ReturnType<typeof createClient>`
// in helper signatures) typechecks across postgrest-js versions.
import type { SupabaseClient } from '@supabase/supabase-js'

declare module '@supabase/supabase-js' {
  export function createClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: any
  ): SupabaseClient<any, any, any, any, any>
}
