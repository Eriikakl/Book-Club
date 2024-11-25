import { useState } from 'react';
import { View, ImageBackground, StyleSheet, Text } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from '../components/UserContext';
import { Button, TextInput } from 'react-native-paper';

const auth = getAuth();

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useUser();

    const handleLogin = async () => {
        try {

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User logged in:", user.email);
            login({
                email: user.email,
                username: user.email.split('@')[0].split('.')[0]
            });

        } catch (error) {
            console.error("Error logging in user:", error);
        }
    };

    return (
        <View style={{flex: 1 }}>

            <ImageBackground
                source={require('../components/images/bookclub.jpg')}
                style={styles.image}
                resizeMode="cover"
            >
            <Text style={styles.text}>BookClub!</Text>
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                <TextInput
                    style={styles.input}
                    placeholder="Sähköposti"
                    placeholderTextColor="white"
                    value={email}
                    onChangeText={setEmail}
                    activeUnderlineColor='#cfbaba'
                />
                <TextInput
                    style={styles.input}
                    placeholder="Salasana"
                    placeholderTextColor="white"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    activeUnderlineColor='#cfbaba'
                />
                <Button  
                onPress={handleLogin} 
                labelStyle={{ color: 'black', fontSize: 14, width: 100}}
                mode="outlined" 
                buttonColor="#cfbaba"
                >Kirjaudu</Button>
            </View>
            </ImageBackground>



        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
      },
    text: {
        color: 'white',
        fontSize: 46,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 400,
        borderRadius: 5,
        marginTop: 100,
        padding: 80,
        fontFamily: 'Barlow_400Regular',
    },
    input: {
        width: '70%',
        alignSelf: 'center',
        height: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        fontSize: 20,
        color: 'red',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
});

export default LoginScreen;
