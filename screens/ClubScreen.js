import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, onValue } from 'firebase/database';

const database = getDatabase(app);

// Sivulla lista kirjapiireistä
export default function ClubsScreen({ navigation }) {
    const [clubs, setClubs] = useState([]);


    // Haetaan kirjapiirit tietokannasta
    useEffect(() => {
        const clubsRef = ref(database, "/clubs");

        onValue(clubsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setClubs(Object.values(data));
            }
            else {
                setClubs([]);
            }
        })
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={clubs}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        // välitetään kirjapiirin tietoihin clubin tiedot, sekä kirjan tiedot
                        onPress={() => navigation.navigate('ClubDetails', { club: item, book: item.book })}
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
                                {item.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}

            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
});