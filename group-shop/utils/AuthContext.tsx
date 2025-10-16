import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
    token : string | null,
    authenticated : boolean | null
}
type AuthProps = {
    authState?: AuthState;
    logIn?: (username : string, password : string) => Promise<any>;
    logOut?: (username : string, password : string) => Promise<any>;
}

const JWT_TOKEN = "jwt-token";

export const AuthContext = createContext<AuthProps>({});

export function AuthProvider({children} : PropsWithChildren) {
    const [authState, setAuthState] = useState<AuthState>({
        token : null,
        authenticated: null,
    });

    const router = useRouter();
    
    useEffect(() => {
        AsyncStorage.getItem(JWT_TOKEN).then(token => {
            console.log("stored: ", token);
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                setAuthState({
                    token: token,
                    authenticated: true
                });
            }
        })
    }, []);

    const logIn = async (username: string, password : string) => {
        const result = await axios.post('api/auth', { username, password});

        if (result.data.token !== undefined) {
            setAuthState({
                token: result.data.token,
                authenticated: true
            });

            // Attaching key to header to let all future requests know that the user's authenticated. 
            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            await AsyncStorage.setItem(JWT_TOKEN, result.data.token);
            
            router.replace('/');
        }

        return result;
    }

    const logOut = async () => {
        await AsyncStorage.removeItem(JWT_TOKEN);

        axios.defaults.headers.common['Authorization'] = "";

        setAuthState({
            token: null,
            authenticated: null
        });
    }

    return (
        <AuthContext.Provider value={{ authState, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}