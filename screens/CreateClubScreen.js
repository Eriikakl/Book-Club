import { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, push, set } from 'firebase/database';

const database = getDatabase(app);

export default function CreateClubScreen({ navigation }) {

    const [club, setClub] = useState({ name: "", description: "", book: "" });

    const handleCreateClub = () => {
        const clubsRef = ref(database, '/clubs');
        const newClubRef = push(clubsRef);

        // Luodaan klubidata, joka sisältää automaattisesti luodun ID:n
        const clubData = {
            id: newClubRef.key,
            name: club.name,
            description: club.description,
            book: club.book // tyhjät kirjatiedot
        };
        set(newClubRef, clubData)
            .then(() => {
                console.log("Club created:", clubData);
                navigation.goBack();
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
                onChangeText={text => setClub({ ...club, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Club Description"
                value={club.description}
                onChangeText={text => setClub({ ...club, description: text })}
            />
            <Button title="Create" onPress={handleCreateClub} color="#666" />
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
