import { View, Text, StyleSheet, Button } from 'react-native';
import { useState } from 'react';

export default function ClubDetailsScreen({ route, navigation }) {
    const { club } = route.params;
    const { book }  = route.params;
    // Tällä hetkellä ei toimi, sillä kun haetaan kirja piirille,
    // niin route on sama, joten se ei löydä enää clubin nimeä
    

    return (
        <View style={styles.container}>
             {book ? (
                <Text style={{ fontSize: 28 }}>{book.title}</Text>
            ) : (
                <Text style={{ fontSize: 28 }}>Ei kirjaa valittuna</Text>
            )}
            <Text style={{fontSize: 28}}>{club.name}</Text>
            <Text style={{fontSize: 24}}>{club.description}</Text>
            <Button title="Search" onPress={() => navigation.navigate('BookApi')} color="#666" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 20
        
    },
});