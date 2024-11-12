import { useState } from 'react';

import { View, StyleSheet, FlatList, TextInput, Button, TouchableOpacity, Text } from "react-native";

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, push } from 'firebase/database';

const database = getDatabase(app);

export default function BookRestApi({ navigation, route }) {

    const [keyword, setKeyword] = useState("");
    const [books, setBooks] = useState([]);

    // hakee kirjan tiedot API:sta
    const handleFetch = () => {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${keyword}`)
            .then(response => {
                if (!response.ok)
                    throw new Error("Error in fetch: " + response.statusText);

                return response.json();
            })
            .then(data => setBooks(data.items))
            .catch(error => console.error(error))
    }


    const handleSave = async (book) => {
        const club = route.params.club; // Otetaan klubin tiedot vastaan
        const clubsRef = ref(database, `/clubs/${club.id}/books`);

        try {
            await push(clubsRef, { title: book.volumeInfo.title, authors: book.volumeInfo.authors, image: book.volumeInfo.imageLinks.smallThumbnail }); // tallennetaan kirjan tieto tietylle klubille
            console.log("Kirja tallennettu klubiin:", club.name, book.volumeInfo.title, book.volumeInfo.authors, book.volumeInfo.imageLinks.smallThumbnail);
            navigation.navigate('ClubDetails', { club }); // navigoidaan takaisin klubin sivulle
        } catch (error) {
            console.error("Virhe kirjan tallentamisessa:", error);
        }
    };
    return (
        <View style={styles.container}>
            <View >
                <TextInput
                    style={{ width: 300, marginBottom: 10 }}
                    label="keyword"
                    value={keyword}
                    onChangeText={text => setKeyword(text)}
                />
                <Button title="Search" onPress={handleFetch}>Search</Button>

                <FlatList
                    data={books}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSave(item)}
                        >
                            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={{
                                    fontSize: 18,
                                    backgroundColor: 'lightblue',
                                    padding: 20,
                                    width: "90%",
                                    marginVertical: 8,
                                    marginHorizontal: 16,
                                }}>
                                    {item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown'} - {item.volumeInfo.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                />
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});