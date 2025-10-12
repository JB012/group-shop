import { AuthContext, AuthProvider } from '@/utils/AuthContext';
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';

export default function Layout() {
  const authState = useContext(AuthContext);
  
  if (!authState.isLoggedIn) {
      return <Redirect href={"/login"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

