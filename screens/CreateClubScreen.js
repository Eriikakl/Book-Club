import { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { getAuth } from "firebase/auth";

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { ref, push, set, get, query, orderByChild, equalTo, getDatabase } from "firebase/database";

const database = getDatabase(app);

export default function CreateClubScreen({ navigation }) {

    const [club, setClub] = useState({ name: "", description: "", books: [], image: "", creator: null, tags: [] });

    const tagOptions = [
        { label: 'Adventure', value: 'adventure' },
        { label: 'True crime', value: 'true crime' },
        { label: 'Fantasy', value: 'fantasy' },
        { label: 'Sci-Fi', value: 'scifi' },
        { label: 'Mystery', value: 'mystery' },
        { label: 'Classic', value: 'classic' },
        { label: 'Dystopian', value: 'dystopian' },
        { label: 'Horror', value: 'horror' },
        { label: 'Thriller', value: 'thriller' },
        { label: 'Historical fiction', value: 'historical fiction' },
        { label: 'Romance', value: 'romance' },
        { label: 'Young adult', value: 'young adult' },
    ];

    // Käsitellään valitut tagit
    const handleTagSelect = (selectedValue) => {
        const selectedTag = tagOptions.find(tag => tag.value === selectedValue);
        setClub((prevClub) => {
            const isSelected = prevClub.tags.some(tag => tag.value === selectedTag.value);
            const updatedTags = isSelected
                ? prevClub.tags.filter(tag => tag.value !== selectedTag.value)
                : [...prevClub.tags, selectedTag];
            return { ...prevClub, tags: updatedTags };
        });
    };

    // Tallennetaan luotu klubi
    const handleCreateClub = () => {

        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("Käyttäjä ei ole kirjautunut sisään");
            return;
        }
        const creatorId = currentUser.uid;

        const clubsRef = ref(database, '/clubs');

        // Tarkistetaan, ettei lisätä saman nimistä klubia
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
                        followers: 0,
                        tags: club.tags
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
            <ScrollView style={{ maxHeight: 200 }}>
                {tagOptions.map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        style={[
                            styles.tagButton,
                            club.tags.some(tag => tag.value === item.value) && styles.selectedTag,
                        ]}
                        onPress={() => handleTagSelect(item.value)}
                    >
                        <Text
                            style={[
                                styles.tagText,
                                club.tags.some(tag => tag.value === item.value) && styles.selectedTagText,
                            ]}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Button title="Create" onPress={handleCreateClub} color="#666" />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fafaf7'
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
    tagButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        marginRight: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f5f5f5',
    },
    selectedTag: {
        backgroundColor: '#cfbaba',
    },
    tagText: {
        fontSize: 16,
        color: '#333',
    },
    selectedTagText: {
        color: '#fff',
    },
});
