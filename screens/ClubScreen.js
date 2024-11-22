import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
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
                        <View style={{
                            
                            backgroundColor: '#695F5F',
                            padding: 20,
                            marginVertical: 8,
                            marginHorizontal: 16,
                            width: "350",
                            flexDirection: "row",
                            justifyContent: "flex-start"
                            
                        }}>
                            {item.image ? (
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.image}
                                />
                            ) : (
                                <Image
                                    source={require('../components/images/empty.png')}
                                    style={styles.image}
                                />
                            )}
                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', width: '70%' }}>
                                <Text style={{ fontSize: 20, marginLeft: 20, color: "white" }} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={{ fontSize: 16, marginLeft: 20, color: "white" }} numberOfLines={1} ellipsizeMode="tail">
                                    {item.description}
                                </Text>
                                <Text style={{ fontSize: 14, marginLeft: 20, flexWrap: 'wrap', marginTop:20, color: "white" }} numberOfLines={2} ellipsizeMode="tail">
                                    {item.tags.map((tag, index) => (
                                        <Text key={index} style={{ marginRight: 10 }}>
                                            #{tag.label} 
                                        </Text>
                                    ))}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

            />
            <TouchableOpacity onPress={() => navigation.navigate('CreateClub')}>
                <Text style={{ marginRight: 10, color: '#666' }}>Create new</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafaf7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    image: {
        width: 100,
        height: 100,
    }
});