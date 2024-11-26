import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { IconButton, Searchbar } from 'react-native-paper';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, onValue } from 'firebase/database';

const database = getDatabase(app);

// Sivulla lista kirjapiireistä
export default function ClubsScreen({ navigation }) {
    const [clubs, setClubs] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [filteredClubs, setFilteredClubs] = useState([]);

    // Haetaan kirjapiirit tietokannasta
    useEffect(() => {
        const clubsRef = ref(database, "/clubs");

        onValue(clubsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setClubs(Object.values(data));
                setFilteredClubs(Object.values(data));
            }
            else {
                setClubs([]);
                setFilteredClubs([]);
            }
        })
    }, []);

    // haetaan klubia hakusanalla
    const handleSearch = (query) => {
        setKeyword(query);
        if (query === '') {
            setFilteredClubs(clubs);
        } else {
            const filtered = clubs.filter(club =>
                club.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredClubs(filtered);
        }
    };

    return (
        <View style={styles.container}>
            <Searchbar
                style={{ backgroundColor: "white" }}
                placeholder="Etsi hakusanalla"
                onChangeText={handleSearch}
                value={keyword}
            />
            <FlatList
                style={{ marginBottom: 10 }}
                data={filteredClubs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ClubDetails', { club: item })} // Navigointi klubin profiiliin
                    >
                        <View
                            style={{
                                backgroundColor: '#fafaf7',
                                borderColor:"lightgrey",
                                borderBottomWidth: 1,
                                padding: 20,
                                marginVertical: 8,
                                marginHorizontal: 16,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                            }}
                        >
                            {item.image ? (
                                <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
                            ) : (
                                <Image source={require('../components/images/empty.png')} style={{ width: 100, height: 100 }} />
                            )}

                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', width: '70%' }}>
                                <Text style={{ fontSize: 20, marginLeft: 20, color: '#695F5F', fontFamily: 'Barlow_400Regular' }} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={{ fontSize: 16, marginLeft: 20, color: '#695F5F', fontFamily: 'Barlow_400Regular' }} numberOfLines={1} ellipsizeMode="tail">
                                    {item.description}
                                </Text>
                                <Text style={{ fontSize: 14, marginLeft: 20, marginTop: 20, color: '#695F5F', fontFamily: 'Barlow_400Regular' }} numberOfLines={2} ellipsizeMode="tail">
                                    {item.tags.map((tag, index) => (
                                        <Text key={index} style={{ marginRight: 10 }}>
                                            {" #" + tag.label}
                                        </Text>
                                    ))}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <IconButton
                icon="plus"
                size={46}
                onPress={() => navigation.navigate('CreateClub')}
                color="white"
                style={styles.button}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafaf7',
        alignItems: 'center',
        justifyContent: 'center',

    },
    image: {
        width: 100,
        height: 100,
    },
    button: {
        backgroundColor: '#cfbaba',
        borderRadius: 10,
        position: 'absolute',
        bottom: 10,
        right: 10,


    },
});