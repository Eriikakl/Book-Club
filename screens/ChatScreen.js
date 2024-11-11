import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button } from 'react-native';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, onValue, push } from 'firebase/database';

const database = getDatabase(app);

export default function ChatScreen({ route }) {
    const { club } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef(null);

    // Haetaan viestit tietokannasta
    useEffect(() => {
        const msgRef = ref(database, `/messages/${club.id}`);

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
            const msgRef = ref(database, `/messages/${club.id}`);
            const newMsg = {
                text: newMessage,
                timestamp: new Date().toISOString()
            };
            // Tallennetaan Firebaseen
            await push(msgRef, newMsg);
            setNewMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{club.name} - Keskustelu</Text>
            <FlatList
                ref={flatListRef}
                data={messages} // viestit

                renderItem={({ item }) => (
                    <View style={styles.messageItem}>
                        <Text style={styles.timestamp}>
                            {new Date(item.timestamp).toLocaleString("fi-FI", {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'

                            })}
                        </Text>
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <TextInput
                multiline
                style={styles.input}
                placeholder="message.."
                value={newMessage}
                onChangeText={setNewMessage}
            />
            <Button title="Send" onPress={handleSendMessage} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    messageItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
});