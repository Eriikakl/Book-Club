import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, onValue } from 'firebase/database';

const database = getDatabase(app);

// Sivulla lista klubeista
export default function ClubsScreen({ navigation }) {
    const [club, setClub] = useState({ name: "", description: "" });
    const [clubs, setClubs] = useState([]);


    // Haetaan klubit tietokannasta
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
                        onPress={() => navigation.navigate('ClubDetails', { club: item })}
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