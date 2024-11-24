import { useState } from 'react';

import { View, StyleSheet, FlatList, TouchableOpacity, Text, Image } from "react-native";

import { Button, Searchbar, ActivityIndicator, } from 'react-native-paper';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, push } from 'firebase/database';

const database = getDatabase(app);

export default function BookRestApi({ navigation, route }) {

    const [keyword, setKeyword] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    // hakee kirjan tiedot API:sta
    const handleFetch = () => {
        setLoading(true);
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${keyword}`)
            .then(response => {
                if (!response.ok)
                    throw new Error("Error in fetch: " + response.statusText);

                return response.json();
            })
            .then(data => setBooks(data.items))
            .catch(error => console.error(error))
            .finally(() => {
                setLoading(false);
            });
    }

    // Tallennetaan kirjan tiedot klubille
    const handleSave = async (book) => {
        const club = route.params.club;
        const clubsRef = ref(database, `/clubs/${club.id}/books`);

        try {
            await push(clubsRef, {
                title: book.volumeInfo.title || "Unknown",
                authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown",
                image: book.volumeInfo.imageLinks?.smallThumbnail || "Unknown"
            });

            navigation.navigate('ClubDetails', { club }); // navigoidaan takaisin klubin sivulle
        } catch (error) {
            console.error("Virhe kirjan tallentamisessa:", error);
        }
    };
    return (
        <View style={styles.container}>
            <View style={{ width: "70%", flexDirection: "row", alignItems: "baseline", justifyContent: 'space-evenly' }}>
                <Searchbar
                    style={{ backgroundColor: "white" }}
                    placeholder="Etsi hakusanalla"
                    onChangeText={text => setKeyword(text)}
                    value={keyword}
                />
                <Button
                    style={{}}
                    labelStyle={{ color: 'black' }}
                    mode="outlined"
                    title="Search"
                    onPress={handleFetch}>Etsi</Button>
            </View>
            
            {loading ? (
                <ActivityIndicator animating={true} size="small" color="#695F5F" />
            ) : (
                <FlatList
                    data={books}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSave(item)}
                        >

                            <View style={{
                                fontSize: 18,
                                backgroundColor: '#695F5F',
                                padding: 20,
                                width: "90%",
                                marginVertical: 10,
                                marginHorizontal: 16,
                                flexDirection: "row",
                                alignItems: 'center'


                            }}>
                                <Image source={!item.volumeInfo.imageLinks?.smallThumbnail ? require('../components/images/noimage.png') : { uri: item.volumeInfo.imageLinks.smallThumbnail }} style={{ width: 50, height: 80 }}></Image>
                                <View style={{ flexDirection: "column", justifyContent: 'flex-start', alignItems: 'baseline' }}>
                                    <Text style={{ flexWrap: 'wrap', flexShrink: 1, maxWidth: 200, fontSize: 18, marginLeft: 20 }}>{item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown'}</Text>
                                    <Text style={{ flexWrap: 'wrap', flexShrink: 1, maxWidth: 200, fontSize: 14, marginLeft: 20 }}>{item.volumeInfo.title}</Text>
                                </View>

                            </View>

                        </TouchableOpacity>
                    )}

                />
            )}

        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        marginTop: 2,
        flex: 1,
        backgroundColor: '#fff',

    },
});