import { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

// yhteys projektiin
import { app } from '../firebaseConfig'; 
// yhteys projektin palveluihin
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';

const database = getDatabase(app);

export default function CreateClubScreen({ navigation }) {

    const [club, setClub] = useState({name: "", description: ""});
    const [clubs, setClubs] = useState([]);

    const handleCreateClub = () => {
        const clubsRef = ref(database, '/clubs'); // Määritä polku /clubs
        push(clubsRef, club) // Lisää uusi club
            .then(() => {
                navigation.goBack(); // Siirry takaisin klubilistanäkymään
                console.log("Club created:", club);
            })
            .catch((error) => {
                console.error("Error creating club:", error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Club</Text>
            <TextInput
                style={styles.input}
                placeholder="Club Name"
                value={club.name}
                onChangeText={text => setClub({...club, name: text})}
            />
            <TextInput
                style={styles.input}
                placeholder="Club Description"
                value={club.description}
                onChangeText={text => setClub({...club, description: text})}
            />
            <Button title="Create" onPress={handleCreateClub} />
        </View>
    );

}

// Tyylit
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});
