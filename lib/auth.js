import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Resolves the current user from:
 * 1) Cookie session (normal browser navigation)
 * 2) Authorization: Bearer <token> (what the frontend currently sends)
 */
export async function getAuthenticatedUser(request) {
  // 1. Cookie-based session
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {
            // no-op in API routes
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!error && user) return user;
  } catch (err) {
    console.error("Cookie auth error:", err);
  }

  // 2. Bearer token
  try {
    const authHeader =
      request?.headers?.get?.("authorization") ||
      request?.headers?.get?.("Authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (!error && user) return user;
    }
  } catch (err) {
    console.error("Bearer auth error:", err);
  }

  return null;
}