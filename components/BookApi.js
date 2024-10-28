import { useState } from 'react';

import { View, StyleSheet, FlatList, TextInput, Button, TouchableOpacity, Text } from "react-native";

export default function BookRestApi({ navigation }) {


    const [keyword, setKeyword] = useState("");
    const [books, setBooks] = useState([]);

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
                        <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ClubDetails', { book: item });
                        }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                                <Text style={{
                                    fontSize: 18,
                                    backgroundColor: 'lightblue',
                                    padding: 20,
                                    width: "90%",
                                    marginVertical: 8,
                                    marginHorizontal: 16,
                                }}>
                                    {item.volumeInfo.title}
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