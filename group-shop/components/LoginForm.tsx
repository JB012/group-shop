import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native"

export default function LoginForm() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Enter your username" onChangeText={setUser} value={user}></TextInput>
            <TextInput style={styles.input} placeholder="Enter your password" onChangeText={setPassword} value={password}></TextInput>
            <Button title="Log In"></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: '30px'
    },
    input: {
        borderWidth: 1,
        borderRadius: '50px'
    }
    
});