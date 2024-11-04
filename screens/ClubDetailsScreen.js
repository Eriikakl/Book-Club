import { View, Text, StyleSheet, Button } from 'react-native';

export default function ClubDetailsScreen({ route, navigation }) {
    // otetaan tiedot vastaan kirjapiiristä sekä kirjasta
    const { club } = route.params;
    const { book } = route.params;


    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontSize: 28 }}>{club.name}</Text>
                <Text style={{ fontSize: 20 }}>{club.description}</Text>
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
                <Text style={{ fontSize: 22 }}>Avaa keskustelu:</Text>
                <Button title="Chat" onPress={() => navigation.navigate('ChatScreen', { club })} color="#666" />
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