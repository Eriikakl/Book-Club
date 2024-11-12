import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';

import * as ImagePicker from 'expo-image-picker';



// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, set, get, onValue, query, orderByKey, limitToLast, push } from 'firebase/database';

const database = getDatabase(app);

export default function ClubDetailsScreen({ route, navigation }) {
    // otetaan tiedot vastaan kirjapiiristä sekä kirjasta
    const { club } = route.params;
    const { user } = useUser();
    const [isFollowing, setIsFollowing] = useState(false);
    const [book, setBook] = useState([]);
    const [clubinfo, setClubinfo] = useState();
    const [imageUrl, setImageUrl] = useState();

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

    // haetaan klubin tiedot
    useEffect(() => {
        const clubRef = ref(database, `clubs/${club.id}`);

        onValue(clubRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setClubinfo(Object.values(data));
                const imageUrli = Object.values(data)[0];
                setImageUrl(imageUrli.image)
                console.log(imageUrli.image);
            }
            else {
                setClubinfo([]);
            }
        })
    }, []);

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
            const imageUri = result.assets[0].uri;
            //  tallennetaan tietokantaan
            const clubsRef = ref(database, `clubs/${club.id}`);
            await push(clubsRef, { image: imageUri });
            console.log("Kuva tallennettu onnistuneesti tietokantaan:", imageUri);
        }
    };

    // tarkistaa seuraako käyttäjä ryhmää
    useEffect(() => {
        if (user) {
            const checkFollowingStatus = async () => {
                const userFollowingRef = ref(database, `users/${user.username}/following/${club.name}`);

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
        if (user) {

            try {
                // Jos käyttäjä ei ole vielä seurannut, lisätään seuraaminen
                if (isFollowing) {
                    // Poistetaan seuraaminen
                    await set(ref(database, 'users/' + user.username + '/following/' + club.name), null);
                    setIsFollowing(false);
                    console.log('Olet lopettanut seuraamisen.');
                } else {
                    // Lisätään seuraaminen
                    await set(ref(database, 'users/' + user.username + '/following/' + club.name), true);
                    setIsFollowing(true);
                    console.log('Olet alkanut seurata.');
                }
            } catch (error) {
                console.error("Error updating following:", error);
                console.log('Virhe', 'Seuraamisen tallentamisessa tapahtui virhe.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.top}>

                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                    />
                ) : isFollowing && (
                    <Button title="Pick an image" onPress={pickImage} />
                )}
                <Text style={{ fontSize: 28 }}>{club.name}</Text>
            </View>


            <View style={styles.afterTop}>
                <Button
                    title={isFollowing ? 'Lopeta seuraaminen' : 'Seuraa'}
                    onPress={handleFollow}
                />
            </View>
            <View style={{ backgroundColor: "lightblue", padding: 20, borderRadius: 30, margin: 10 }}>
                <Text style={{ fontSize: 16 }}>{club.description}</Text>
            </View>



            <View style={styles.book}>

                <Text style={{ fontSize: 18 }}>Luettava kirja:</Text>
                {book.image && <Image source={{ uri: book.image }} style={{ width: 100, height: 150 }} />}
                {book.title ? (
                    <Text style={{ fontSize: 16 }}>{book.title}</Text>
                ) : (
                    <Text style={{ fontSize: 16 }}>Ei kirjaa valittuna</Text>
                )}
                {isFollowing && (
                    <>
                        <Button title="Search book" onPress={() => navigation.navigate('BookApi', { club })} color="#666" />
                    </>
                )}

            </View>
            <View style={styles.chat}>
                {isFollowing && (
                    <>

                        <Button
                            title="Avaa keskustelu"
                            onPress={() => navigation.navigate('ChatScreen', { club, user })}
                            color="#666"
                        />
                    </>
                )}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        flexDirection: "row",
        justifyContent: 'space-around'
    },
    afterTop: {
        alignItems: "flex-end",
        flexDirection: "row",
        justifyContent: 'flex-end'
    },
    book: {
        alignItems: "flex-start",
        flexDirection: "Column",
        justifyContent: 'space-between'
    },
    chat: {
        marginTop: 60,
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: 'space-evenly'
    },
});