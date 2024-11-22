import { StyleSheet, Text, View } from 'react-native';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, onValue } from 'firebase/database';

const database = getDatabase(app);

export default function HomeScreen() {
  const { user } = useUser();
  const [clubs, setClubs] = useState(null);

  // Haetaan käyttäjän klubit tietokannasta
  useEffect(() => {
    if (user && user.username) {
      const clubRef = ref(database, `/users/${user.username}/following`);

      const unsubscribe = onValue(clubRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Suodatetaan seuratut klubit, joilla arvo on `true`
          const followedClubs = Object.keys(data).filter((clubName) => data[clubName] === true);
          setClubs(followedClubs); // Tallennetaan klubien nimet
        } else {
          setClubs([]);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      {user ? (
        <Text>Welcome back, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!</Text>
      ) : (
        <Text>Please log in to access this feature.</Text>
      )}
      <Text>Your Followed Clubs:</Text>
      {clubs ? (
        clubs.length > 0 ? (
          clubs.map((club, index) => (
            <Text key={index}>{club}</Text> // Näytetään seurattujen klubien nimet
          ))
        ) : (
          <Text>No clubs followed</Text>
        )
      ) : (
        <Text>Loading followed clubs...</Text>
      )}
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
});