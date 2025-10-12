import { AuthContext, AuthProvider } from "@/utils/AuthContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

export default function RootLayout() {
    // Can't redirect here because navigation tree wouldn't exist. 

    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name='(protected)' options={{headerShown: false}}/>
            </Stack>
        </AuthProvider>
    )
}