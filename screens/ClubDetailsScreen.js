import { View, Text, StyleSheet, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';

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
    const [date, setDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Tallennetaan lukupiirin kokoontumispäivä tietokantaan
    const onDateChange = async (event, selectedDate) => {
        setShowDatePicker(false);
        setDate(selectedDate);

        try {
            const DateTime = new Date(selectedDate).toISOString();
            const dateRef = ref(database, `clubs/${club.id}`);
            await update(dateRef, { dateTime: DateTime });
        } catch (error) {
            console.error("Error updating date:", error);
        }
        showTimePickerModal();
    };
    // Tallennetaan lukupiirin kokoontumispäivä tietokantaan
    const onTimeChange = async (event, selectedTime) => {

        if (selectedTime) {
            setShowTimePicker(false);

            try {
                const newDate = new Date(date || new Date());
                newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());

                const DateTime = newDate.toISOString();
                setDate(newDate);
                const timeRef = ref(database, `clubs/${club.id}`);
                await update(timeRef, { dateTime: DateTime });

            } catch (error) {
                console.error("Error updating time:", error);
            }
        }


    };
    // Näytetään lukupiirin kokoontumispäivä ja aika
    useEffect(() => {
        const dateRef = ref(database, `clubs/${club.id}`);
        const unsubscribe = onValue(dateRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.dateTime) {
                setDate(new Date(data.dateTime));
            }
        });

        return () => unsubscribe();
    }, [club.id]);

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const showTimePickerModal = () => {
        setShowTimePicker(true);
    };

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

    // Muokataan päivämäärä sopivammaksi
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString('fi-FI', {
            hour12: false,
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

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
                <View style={styles.topText}>
                    <Text style={{ fontSize: 28, fontFamily: 'Barlow_400Regular' }}>{club.name}</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'Barlow_400Regular' }}>{club.followersCount > 0 ? club.followersCount : 0} jäsentä</Text>
                    <Text style={{ fontSize: 14, fontFamily: 'Barlow_400Regular' }}>
                        {club.tags.map((tag, index) => (
                            <Text key={index} style={{ marginRight: 10 }}>
                                {"#" + tag.label + " "}
                            </Text>
                        ))}</Text>
                </View>

            </View>
            <View style={styles.afterTop}>

                <Text style={{ fontSize: 16, fontFamily: 'Barlow_400Regular', padding: 10 }}>{club.description}</Text>

                <Text style={{ fontSize: 18, fontFamily: 'Barlow_400Regular' }}>
                    Seuraava tapaaminen: {date !== null ? formatDate(date) : 'Ei asetettu'}
                </Text>
            </View>

            <View style={styles.buttons}>
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
                {(isFollowing && isCreator) && (
                    <Button labelStyle={{ color: 'black', fontFamily: 'Barlow_400Regular' }}
                        mode="outlined"
                        onPress={showDatePickerModal}
                    >Muokkaa aika</Button>
                )}
            </View>
            <View>



                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date || new Date()}
                        mode="date"
                        is24Hour={true}
                        onChange={onDateChange}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        testID="timePicker"
                        value={date || new Date()}
                        mode="time"
                        is24Hour={true}
                        onChange={onTimeChange}
                    />
                )}
            </View>

            <ScrollView style={{ maxHeight: 400, marginTop: 5 }}>
                <View style={styles.title}>
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
                <View style={styles.title}>
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
        alignItems: "flex-start",
        justifyContent: 'flex-start',
        flexDirection: "row",
    },
    topText: {
        flexDirection: "column",
        marginLeft: 20,
        flexWrap:'nowrap',
        width: 200
    },
    afterTop: {
        flexDirection: "column",
        marginLeft: 20,
        alignItems: 'center'
    },
    buttons: {
        marginTop: 10,
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: 'space-evenly'
    },
    title: {
        alignItems: "baseline",
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: "lightgrey",
        paddingTop: 10,

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