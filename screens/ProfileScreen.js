import { StyleSheet, Text, View } from 'react-native';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, onValue } from 'firebase/database';

const database = getDatabase(app);

export default function ProfileScreen() {
  const { user } = useUser();
  const [clubNames, setClubNames] = useState([]);

  // Haetaan käyttäjän klubit
  useEffect(() => {
    if (user && user.username) {
      const clubRef = ref(database, `/users/${user.username}/following`);

      const unsubscribe = onValue(clubRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Suodatetaan seuratut klubit, joilla arvo on `true`
          const followedClubs = Object.keys(data).filter((clubName) => data[clubName] === true);
          setClubNames(followedClubs); // Tallennetaan klubien nimet
        } else {
          setClubNames([]);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={{ fontSize: 20, justifyContent: 'flex-end' }}>
        <Text style={{ fontSize: 28, justifyContent: 'flex-start' }}>Seuraamasi lukupiirit:</Text>
        {clubNames ? (
          clubNames.length > 0 ? (
            clubNames.map((club, index) => (
              <View key={index} style={{
                backgroundColor: '#ede4e4',
                padding: 20,
                marginVertical: 8,
                marginHorizontal: 16,
                width: "300",
                flexDirection: "row",
                justifyContent: "flex-start"

              }}>
                <Text style={{ fontSize: 20 }} key={index}>{club}</Text>
              </View>
            ))
          ) : (
            <Text>Et seuraa yhtäkään lukupiiriä</Text>
          )
        ) : (
          <Text>Ladataan seuraamiasi lukupiirejä...</Text>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#fafaf7',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },

});