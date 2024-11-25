import { View, Text, StyleSheet, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';

import * as ImagePicker from 'expo-image-picker';

import { getAuth } from 'firebase/auth';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, set, get, onValue, query, orderByKey, limitToLast, update, increment } from 'firebase/database';

const database = getDatabase(app);

export default function ClubDetailsScreen({ route, navigation }) {
    // otetaan kirjapiirin tiedot vastaan kirjapiirilistauksesta
    const { club } = route.params;
    const { user } = useUser();
    const [isFollowing, setIsFollowing] = useState(false);
    const [book, setBook] = useState([]);
    const [isCreator, setIsCreator] = useState(false);
    const [books, setBooks] = useState([]);
    const [imageUri, setImageUri] = useState(club.image);

    // hakee viimeisimmän lisätyn kirjan 
    useEffect(() => {
        const bookRef = ref(database, `clubs/${club.id}/books`);
        const latestBook = query(bookRef, orderByKey(), limitToLast(1));
        onValue(latestBook, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setBook(Object.values(data)[0]);
            }
            else {
                setBook([]);
            }
        })
    }, []);

    //Haetaan lukuhistoria
    useEffect(() => {
        const bookRef = ref(database, `clubs/${club.id}/books`);
        onValue(bookRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const booksArray = Object.values(data);
                setBooks(booksArray.reverse()); // käännetään tuoreimmat ensin
            } else {
                setBooks([]);
            }
        });
    }, [club.id]);


    // Tarkastetaan onko käyttäjä ryhmän luoja
    useEffect(() => {
        const checkIfCreator = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                setIsCreator(false);
                return;
            }
            const clubRef = ref(database, `clubs/${club.id}`);
            const snapshot = await get(clubRef);

            if (snapshot.exists()) {
                const clubData = snapshot.val();
                setIsCreator(clubData.creator === currentUser.uid);
            } else {
                console.error("Klubia ei löytynyt.");
            }

        };

        checkIfCreator();
    }, [club.id]);


    // Profiilikuvan valinta
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            console.log("Permission not granted");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled) {
            const newImageUri = result.assets[0].uri;
    
            try {
                const clubsRef = ref(database, `clubs/${club.id}`);
                await update(clubsRef, { image: newImageUri });
                console.log("Kuva tallennettu onnistuneesti:", newImageUri);
    
                // Päivitä käyttöliittymä heti
                setImageUri(newImageUri);
            } catch (error) {
                console.error("Kuvan tallennuksessa tapahtui virhe:", error);
            }
        }
    };

    // tarkistaa seuraako käyttäjä ryhmää
    useEffect(() => {
        if (user) {
            const checkFollowingStatus = async () => {
                const userFollowingRef = ref(database, `clubs/${club.id}/followers/${user.username}`);

                try {
                    const snapshot = await get(userFollowingRef);
                    if (snapshot.exists()) {
                        setIsFollowing(true);
                    } else {
                        setIsFollowing(false);
                    }
                } catch (error) {
                    console.error("Virhe seuraamistilan tarkistuksessa:", error);
                }
            };
            checkFollowingStatus();
        }
    }, [user, club.name]);



    // suorittaa seuraamiseen tai seuraamisen lopettamiseen tarvittavat toiminnot
    const handleFollow = async () => {
        if (user && club) {

            try {
                // haetaan klubin seuraajat
                const clubRef = ref(database, `clubs/${club.id}/followers`);
                const snapshot = await get(clubRef);
                const followers = snapshot.val() || {};

                // poistetaan seuraaminen
                if (isFollowing) {
                    await set(ref(database, `users/${user.username}/following/${club.name}`), null); // poistetaan klubin tiedot käyttäjän tiedoista
                    setIsFollowing(false);
                    console.log('Olet lopettanut seuraamisen.');

                    const updatedFollowers = { ...followers };
                    delete updatedFollowers[user.username];
                    await set(ref(database, `clubs/${club.id}/followers`), updatedFollowers); // poistetaan käyttäjä klubin seuraajista
                    await update(ref(database, `clubs/${club.id}`), {
                        followersCount: increment(-1), // vähennetään seuraajien määrää
                    });
                } else {
                    // seurataan
                    await set(ref(database, `users/${user.username}/following/${club.name}`), true); // lisätään klubin tiedot käyttäjän tietoihin
                    setIsFollowing(true);
                    console.log('Olet alkanut seurata.');

                    const updatedFollowers = { ...followers, [user.username]: true };
                    await set(ref(database, `clubs/${club.id}/followers`), updatedFollowers); // lisätään käyttäjä klubin seuraajaksi
                    await update(ref(database, `clubs/${club.id}`), {
                        followersCount: increment(1), // lisätään seuraajien määrää
                    });
                }
            } catch (error) {
                console.error("Error updating following:", error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                {imageUri ? (
                    // klubilla on kuva
                    <TouchableOpacity onPress={isFollowing ? pickImage : null}>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                ) : (
                    // klubilla ei ole kuvaa annetaan valmis empty kuva
                    <View>
                        <TouchableOpacity onPress={isFollowing ? pickImage : null}>
                            <Image
                                source={require('../components/images/empty.png')}
                                style={styles.image}
                            />
                        </TouchableOpacity>

                    </View>
                )}
            </View>
            <View style={styles.top}><Text style={{ fontSize: 28, fontFamily: 'Barlow_400Regular' }}>{club.name}</Text>
                <Text style={{ fontSize: 16, fontFamily: 'Barlow_400Regular' }}>{club.followersCount > 0 ? club.followersCount : 0} jäsentä</Text>
                <Text style={{ fontSize: 16, fontFamily: 'Barlow_400Regular' }}>{club.description}</Text>
                <Text style={{ fontSize: 14, fontFamily: 'Barlow_400Regular' }}>
                    {club.tags.map((tag, index) => (
                                        <Text key={index} style={{ marginRight: 10 }}>
                                            {" #" + tag.label}
                                        </Text>
                                    ))}</Text>
                </View>

            <View style={styles.afterTop}>
                <Button
                    labelStyle={{ color: 'black', fontFamily: 'Barlow_400Regular' }}
                    mode="outlined"
                    onPress={handleFollow}
                >{isFollowing ? 'Poistu' : 'Liity'}
                </Button>
                {isFollowing && (
                    <>

                        <Button
                            labelStyle={{ color: 'black', fontFamily: 'Barlow_400Regular' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('ChatScreen', { club, user })}
                        >Keskustelu</Button>
                    </>
                )}
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
                <View style={styles.booktitle}>
                    <Text style={{ fontSize: 18, fontFamily: 'Barlow_700Regular' }}>Luettava kirja:</Text>
                    {(isFollowing && isCreator) && (
                        <>
                            <Button
                                labelStyle={{ color: 'black', fontFamily: 'Barlow_400Regular' }}
                                mode="outlined"
                                onPress={() => navigation.navigate('BookApi', { club })}
                            >Hae kirja</Button>
                        </>
                    )}
                </View>
                <View style={styles.book}>
                    {book.image && <Image source={book.image === "Unknown" ? require('../components/images/noimage.png') : { uri: book.image }} style={{ width: 100, height: 150 }} />}
                    {book.title ? (
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Barlow_400Regular',
                            maxWidth: 115,
                            overflow: 'hidden',
                            flexShrink: 1
                        }}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {book.title}
                        </Text>
                    ) : (
                        <Text style={{ fontSize: 16 }}>Ei kirjaa valittuna</Text>
                    )}

                </View>
                <View style={styles.booktitle}>
                    <Text style={{ fontSize: 18, fontFamily: 'Barlow_700Regular' }}>Lukuhistoria:</Text>
                </View>
                <View style={styles.books}>
                    {books.length > 0 ? (
                        <FlatList
                            data={books}
                            horizontal={true}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View>
                                    {item.image && (
                                        <Image source={item.image === "Unknown" ? require('../components/images/noimage.png') : { uri: item.image }} style={{ width: 100, height: 150 }} />
                                    )}
                                    <View>
                                        <Text style={{
                                            fontSize: 16,
                                            maxWidth: 100,
                                            fontFamily: 'Barlow_400Regular',
                                            overflow: 'hidden',
                                            flexShrink: 1
                                        }}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >{item.title}
                                        </Text>
                                        {item.author && (
                                            <Text>Kirjoittaja: {item.author}</Text>
                                        )}
                                    </View>
                                </View>
                            )}
                            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                            initialNumToRender={10}
                            windowSize={5}
                        />
                    ) : (
                        <Text>Ei kirjoja saatavilla</Text>
                    )}

                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafaf7',
        padding: 20

    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden'
    },
    top: {
        alignItems: "center",
        flexDirection: "column",
        justifyContent: 'space-around',
    },
    afterTop: {
        marginTop: 10,
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: 'space-evenly'
    },
    booktitle: {
        alignItems: "baseline",
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: "lightgrey",
        paddingTop: 10,
        fontWeight: '800',

    },
    book: {
        marginTop: 10,
        alignItems: "flex-start",
        flexDirection: "column",
        justifyContent: 'space-evenly'
    },
    books: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
});