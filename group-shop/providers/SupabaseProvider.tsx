import { useSession } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

interface SupabaseClientType {
    supabase: SupabaseClient
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const SupabaseContext = createContext<SupabaseClientType>({supabase: createClient(supabaseUrl!, supabasePublishableKey!)});

export default function SupabaseProvider({children} : PropsWithChildren) {
    const {session} = useSession();
    const [supabase, setSupabase] = useState<SupabaseClient>(createClient(supabaseUrl!, supabasePublishableKey!));

    useEffect(() => {
        const newClient = createClient(supabaseUrl!, supabasePublishableKey!, {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
        async accessToken() {
        // Supabase knows the Clerk user through the Clerk token. Without the token,
        // row data will violate Row-Level Security (RLS) policy
          return session?.getToken() ?? null
        },
        });

        setSupabase(newClient);
    }, [session]);

    
    return (
        <SupabaseContext.Provider value={{supabase}}>
            {children}
        </SupabaseContext.Provider>
    )
}

export const useSupabase = () => {
    const {supabase} = useContext(SupabaseContext);

    return supabase;
}