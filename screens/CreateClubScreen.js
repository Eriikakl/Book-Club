import { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

import { getAuth } from "firebase/auth";

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { ref, push, set, get, query, orderByChild, equalTo, getDatabase } from "firebase/database";

const database = getDatabase(app);

export default function CreateClubScreen({ navigation }) {

    const [club, setClub] = useState({ name: "", description: "", books: [], image: "", creator: null });

   

    const handleCreateClub = () => {

        const auth = getAuth(); 
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("Käyttäjä ei ole kirjautunut sisään");
            return;
        }
        const creatorId = currentUser.uid;

        const clubsRef = ref(database, '/clubs');
        
        // Hae klubit ja tarkista, onko samannimistä
        const clubQuery = query(clubsRef, orderByChild("name"), equalTo(club.name));
    
        get(clubQuery)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // Jos saman niminen klubi löytyy, näytä viesti
                    console.error("Club with the same name already exists.");
                    alert("A club with the same name already exists. Please choose a different name.");
                } else {
                    // Luodaan uusi klubi, koska samannimistä ei ole
                    const newClubRef = push(clubsRef);
    
                    const clubData = {
                        image: "",
                        id: newClubRef.key,
                        name: club.name,
                        description: club.description,
                        books: [], // tyhjät kirjatiedot
                        creator: creatorId,
                        followers: 0
                    };
    
                    set(newClubRef, clubData)
                        .then(() => {
                            console.log("Club created:", clubData);
                            navigation.goBack();
                        })
                        .catch((error) => {
                            console.error("Error creating club:", error);
                        });
                }
            })
            .catch((error) => {
                console.error("Error checking for existing clubs:", error);
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
