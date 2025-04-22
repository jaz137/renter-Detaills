"use client"

import { createClient } from "@/lib/supabase-browser"
import type { User, Session } from "@supabase/supabase-js"


export async function getSession(): Promise<{ session: Session | null; user: User | null; error: Error | null }> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error

    return {
      session: data.session,
      user: data.session?.user || null,
      error: null,
    }
  } catch (error: any) {
    console.error("Error getting session:", error)
    return {
      session: null,
      user: null,
      error,
    }
  }
}


export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return {
      session: data.session,
      user: data.user,
      error: null,
    }
  } catch (error: any) {
    console.error("Error signing in:", error)
    throw error
  }
}


export async function signOut() {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return { error: null }
  } catch (error: any) {
    console.error("Error signing out:", error)
    throw error
  }
}


export async function isAuthenticated(): Promise<boolean> {
  const { session, error } = await getSession()
  return !!session && !error
}
