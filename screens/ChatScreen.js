import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { View, Text, FlatList, StyleSheet, } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, onValue, push } from 'firebase/database';

const database = getDatabase(app);

export default function ChatScreen({ route }) {
    const { club, user } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef(null);

    // Haetaan viestit tietokannasta
    useEffect(() => {
        const msgRef = ref(database, `/messages/${club.name}`);

        const unsubscribe = onValue(msgRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setMessages(Object.values(data));
                flatListRef.current.scrollToEnd({ animated: true });
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, [club.id]);

    // Viestin lähetys
    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const msgRef = ref(database, `/messages/${club.name}`);
            const newMsg = {
                text: newMessage,
                timestamp: new Date().toISOString(),
                user: user.username
            };
            // Tallennetaan Firebaseen
            await push(msgRef, newMsg);
            setNewMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{club.name}</Text>
            <FlatList
                ref={flatListRef}
                data={messages}

                renderItem={({ item }) => (
                    <View style={styles.messageItem}>
                        <Text style={{fontFamily: 'Barlow_400Regular'}}>
                            {new Date(item.timestamp).toLocaleString("fi-FI", {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'

                            })}
                            <Text style={{fontFamily: 'Barlow_400Regular'}}> @{item.user.charAt(0).toUpperCase() + user.username.slice(1)}</Text>
                        </Text>
                        <Text style={{fontFamily: 'Barlow_400Regular'}}>{item.text}</Text>
                    </View>
                )}
            />
            <TextInput
                mode="outlined"
                style={styles.input}
                placeholder="Kirjoita viesti.."
                value={newMessage}
                onChangeText={setNewMessage}
                right={<TextInput.Icon icon="send" onPress={handleSendMessage} />}
                onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Enter') {
                        handleSendMessage();
                    }
                }}
            />
            
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fafaf7',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        fontFamily: 'Barlow_400Regular'
    },
    input: {
        backgroundColor: "white",
    },
    messageItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
});
