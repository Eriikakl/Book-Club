import { useState } from 'react';
import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button } from 'react-native';


// Lisää viestit tietokantaan!! 

export default function ChatScreen({ route }) {
    const { club } = route.params;
    const [messages, setMessages] = useState([]); 
    const [newMessage, setNewMessage] = useState(''); 

    // Viestin lähetys
    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // Lisätään uusi viesti
            setMessages([...messages, { id: messages.length + 1, text: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{club.name} - Keskustelu</Text>
            <FlatList
                data={messages} // viestit
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.messageItem}>
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <TextInput
                style={styles.input}
                placeholder="message.."
                value={newMessage}
                onChangeText={setNewMessage} // Päivitetään uusi viesti
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
