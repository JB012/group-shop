import { AuthContext, AuthProvider } from "@/utils/AuthContext";
import { Redirect, Slot, Stack } from "expo-router";
import { useContext } from "react";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

export default function RootLayout() {
    // Can't redirect here because navigation tree wouldn't exist. 

    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <Stack>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                <Stack.Screen name="(home)" options={{headerShown: false}}/>
            </Stack>
        </ClerkProvider>
    )
}