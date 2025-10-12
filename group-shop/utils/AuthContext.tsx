import { createContext, PropsWithChildren, useState } from "react";
import { useRouter } from "expo-router";

type AuthState = {
    isLoggedIn: boolean,
    logIn: () => void;
    logOut: () => void;
}

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    logIn: () => {},
    logOut: () => {}
});

export function AuthProvider({children} : PropsWithChildren) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const router = useRouter();
    
    const logIn = () => {
        setLoggedIn(true);
        router.replace('/');
    }

    const logOut = () => {
        setLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}