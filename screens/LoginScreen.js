import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // Käyttäjän tiedot
            console.log("User logged in:", user.email);
            navigation.navigate("Home")
        } catch (error) {
            console.error("Error logging in user:", error);
        }
    };

    return (
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 200 }}>
            <TextInput

                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput

                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

export default LoginScreen;
