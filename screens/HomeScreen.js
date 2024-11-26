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
  const [topClubs, setTopClubs] = useState([]);
  const [popularTag, setPopularTag] = useState(null);

  // Haetaan suosituimmat klubit 
  useEffect(() => {
    const clubsRef = ref(database, '/clubs');
    const unsubscribe = onValue(clubsRef, (snapshot) => {
      const clubsData = snapshot.val();
      if (clubsData) {
        const allClubs = Object.keys(clubsData).map((clubId) => {
          const followersCount = clubsData[clubId]?.followersCount || 0;
          return { clubId, followersCount };
        });
        allClubs.sort((a, b) => b.followersCount - a.followersCount);
        const topTwoClubs = allClubs.slice(0, 2);

        const topClubsWithNames = [];
        topTwoClubs.forEach((club) => {
          const clubRef = ref(database, `/clubs/${club.clubId}`);
          onValue(clubRef, (clubSnapshot) => {
            const clubData = clubSnapshot.val();
            if (clubData) {
              topClubsWithNames.push({
                clubId: club.clubId,
                clubName: clubData.name,
                followersCount: club.followersCount,
              });
            }
          });
        });
        setTopClubs(topClubsWithNames);
      } else {
        setTopClubs([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Haetaan käytetyimmät tag:it
  useEffect(() => {
    const clubsRef = ref(database, '/clubs');
    const unsubscribe = onValue(clubsRef, (snapshot) => {
      if (snapshot.exists()) {
        const clubsData = snapshot.val();

        const allTags = Object.values(clubsData).flatMap(club =>
          club.tags ? club.tags.map(tag => tag.label) : []
        );

        if (allTags.length === 0) {
          setPopularTag(null);
          return;
        }

        const tagCounts = allTags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {});

        const mostPopularTag = Object.keys(tagCounts).reduce((a, b) =>
          tagCounts[a] > tagCounts[b] ? a : b
        );

        console.log("Most popular tag:", mostPopularTag, "Count:", tagCounts[mostPopularTag]);
        setPopularTag(mostPopularTag);
      } else {
        setPopularTag(null);
      }
    }, (error) => {
      console.error("Error listening to clubs data:", error);
    });

    return () => unsubscribe();
  }, []);




  return (
    <View style={styles.container}>
      <View>
        {user ? (
          <Text style={{ fontSize: 20, fontFamily: 'Barlow_400Regular' }}>Tervetuloa takaisin, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!</Text>
        ) : (
          <Text style={{ fontSize: 20, fontFamily: 'Barlow_400Regular' }}>Kirjaudu, jotta näet kaikki ominaisuudet.</Text>
        )}
      </View>

      <View style={{}}>
        <Text style={{ fontSize: 24, justifyContent: 'flex-start', fontFamily: 'Barlow_400Regular' }}>Suosituimmat lukupiirit:</Text>
        {topClubs ? (
          topClubs.length > 0 ? (
            topClubs.map((club, index) => (
              <View key={index} style={{
                backgroundColor: '#ede4e4',
                padding: 20,
                marginVertical: 8,
                marginHorizontal: 16,
                width: "300",
                flexDirection: "row",
                justifyContent: "flex-start"

              }}>
                <Text style={{ fontSize: 20, justifyContent: 'flex-start', fontFamily: 'Barlow_400Regular' }}>{club.clubName} - {club.followersCount} jäsentä</Text>
              </View>
            ))
          ) : (
            <Text>Et seuraa yhtäkään lukupiiriä</Text>
          )
        ) : (
          <Text>Ladataan seuraamiasi lukupiirejä...</Text>
        )}
        <Text style={{ fontSize: 24, justifyContent: 'flex-start', fontFamily: 'Barlow_400Regular' }}>Suosituin kategoria:</Text>
        {popularTag ? (
          <View style={{
            backgroundColor: '#ede4e4',
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
            width: "300",
            flexDirection: "row",
            justifyContent: "flex-start"

          }}><Text style={{ fontSize: 20, justifyContent: 'flex-start', fontFamily: 'Barlow_400Regular' }}>{popularTag}</Text></View>
        ) : (
          <Text>Suosituinta kategoriaa ei ole :(</Text>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#fafaf7',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 20,
  },

});