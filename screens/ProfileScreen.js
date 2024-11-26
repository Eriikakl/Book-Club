import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useUser } from '../components/UserContext';
import { useState, useEffect } from 'react';

// yhteys projektiin
import { app } from '../firebaseConfig';
// yhteys projektin palveluihin
import { getDatabase, ref, onValue } from 'firebase/database';

const database = getDatabase(app);

export default function ProfileScreen({ navigation }) {
  const { user } = useUser();
  const [followedClubs, setfollowedClubs] = useState([]);
  const [createdClubs, setCreatedClubs] = useState([]);

  // Haetaan käyttäjän luomat klubit
  useEffect(() => {
    const clubsRef = ref(database, '/clubs');

    const unsubscribe = onValue(clubsRef, (snapshot) => {
      const data = snapshot.val();
      const userClubs = [];

      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          if (value.creator === user.uid) {
            userClubs.push({ id: key, ...value });
          }
        });
      }
      setCreatedClubs(userClubs);
    });
    return () => unsubscribe();
  }, [user]);

  // Haetaan käyttäjän seuraamat klubit
  useEffect(() => {
    if (user && user.username) {
      const clubRef = ref(database, `/users/${user.username}/following`);

      const unsubscribe = onValue(clubRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Suodatetaan seuratut klubit, joilla arvo on `true`
          const followedClubs = Object.keys(data).filter((clubName) => data[clubName] === true);
          setfollowedClubs(followedClubs); // Tallennetaan klubien nimet
        } else {
          setfollowedClubs([]);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Image source={require('../components/images/empty.png')}
        style={styles.image}
      />
      <View style={{ justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, justifyContent: 'flex-start', fontFamily: 'Barlow_400Regular' }}>{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</Text>
      </View>


      {createdClubs.length === 0 ? (
        <Text style={{ fontSize: 16, fontFamily: 'Barlow_400Regular', marginTop: 20 }}>
          Sinulla ei vielä ole omia lukupiirejä</Text>

      ) : (
        <>
          <Text style={{ fontSize: 24, justifyContent: 'flex-start', fontFamily: 'Barlow_400Regular' }}>Omat lukupiirit:</Text>
          <FlatList
            data={createdClubs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Lukupiirit', {
                    screen: 'ClubDetails',
                    params: { club: item },
                  });
                }}
              >

                <View style={{
                  backgroundColor: '#ede4e4',
                  padding: 20,
                  marginVertical: 8,
                  marginHorizontal: 16,
                  width: "300",
                  flexDirection: "row",
                  justifyContent: "flex-start"

                }}>
                  <Text style={{ fontSize: 20, fontFamily: 'Barlow_400Regular' }}>{item.name}</Text>
                </View>
              </TouchableOpacity>

            )}
          /></>)}
      <Text style={{ fontSize: 24, justifyContent: 'flex-start', fontFamily: 'Barlow_400Regular' }}>Seuraamasi lukupiirit:</Text>
      {followedClubs ? (
        followedClubs.length > 0 ? (
          followedClubs.map((club, index) => (
            <View key={index} style={{
              backgroundColor: '#ede4e4',
              padding: 20,
              marginVertical: 8,
              marginHorizontal: 16,
              width: "300",
              flexDirection: "row",
              justifyContent: "flex-start"

            }}>
              <Text style={{ fontSize: 20, fontFamily: 'Barlow_400Regular' }} key={index}>{club}</Text>
            </View>
          ))
        ) : (
          <Text>Et seuraa yhtäkään lukupiiriä</Text>
        )
      ) : (
        <Text>Ladataan seuraamiasi lukupiirejä...</Text>
      )}
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden'
  },

});