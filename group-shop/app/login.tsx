import { AuthContext } from "@/utils/AuthContext";
import { Link } from "expo-router";
import { useState, useContext } from "react";
import { Button, TextInput, View, StyleSheet, Text } from "react-native";

export default function Login() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const authState = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 36}}>GroupShop</Text>
            <Text style={{fontSize: 24}}>Login</Text>
            <TextInput style={styles.input} placeholder="Enter your username" onChangeText={setUser} value={user}></TextInput>
            <TextInput style={styles.input} placeholder="Enter your password" onChangeText={setPassword} value={password}></TextInput>
            <Link style={{alignSelf: 'flex-end'}} href={'/forgot'}><Text>Forgot your password?</Text></Link>
            <Button title="Log In" onPress={authState.logIn}></Button>
            <View>
                <Text>Don&apos;t have an account? <Link href={'/signup'}><Text style={{color: 'blue'}}>Sign up</Text></Link></Text>
            </View>
        </View>
    ) 
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50,
        justifyContent: 'center',
        rowGap: 20
    },
    input: {
        borderWidth: 1,
        borderRadius: 10
    }
    
});