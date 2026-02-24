import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
    user: User | null
    session: Session | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<string | null>
    signUp: (email: string, password: string, name: string) => Promise<string | null>
    signOut: () => Promise<void>
    initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    loading: true,

    initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        set({
            user: session?.user ?? null,
            session: session ?? null,
            loading: false,
        })

        // Listen for auth changes (token refresh, sign out, etc.)
        supabase.auth.onAuthStateChange((_event, session) => {
            set({
                user: session?.user ?? null,
                session: session ?? null,
            })
        })
    },

    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return error.message
        set({ user: data.user, session: data.session })
        return null
    },

signUp: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: name }  // stored in user_metadata
        }
    })
    if (error) return error.message
    set({ user: data.user, session: data.session ?? null })
    return null
},

    signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null })
    },
}))