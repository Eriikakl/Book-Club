import { View, Text, StyleSheet, Button } from 'react-native';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, set, get } from 'firebase/database';

const database = getDatabase(app);

export default function ClubDetailsScreen({ route, navigation }) {
    // otetaan tiedot vastaan kirjapiiristä sekä kirjasta
    const { club } = route.params;
    const { book } = route.params;
    const { user } = useUser();
    const [isFollowing, setIsFollowing] = useState(false);

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

    const handleFollow = async () => {
        if (user) {
            const userRef = ref(database, 'users/' + user.username + '/following');

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
            <View>
                <Text style={{ fontSize: 28 }}>{club.name}</Text>
                <Text style={{ fontSize: 20 }}>{club.description}</Text>
                <Button
                    title={isFollowing ? 'Lopeta seuraaminen' : 'Seuraa'}
                    onPress={handleFollow}
                />
            </View>
            <View>
                <Text style={{ fontSize: 22 }}>Luettava kirja:</Text>
                {book ? (
                    <Text style={{ fontSize: 20 }}>{book}</Text>
                ) : (
                    <Text style={{ fontSize: 20 }}>Ei kirjaa valittuna</Text>
                )}
                <Button title="Search book" onPress={() => navigation.navigate('BookApi', { club })} color="#666" />
            </View>
            <View>
                {isFollowing && (
                    <>
                        <Text style={{ fontSize: 22 }}>Avaa keskustelu:</Text>
                        <Button
                            title="Chat"
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
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 20

    },
});