import { View, Text, StyleSheet } from 'react-native';


export default function ClubDetailsScreen({ route }) {
    const { club } = route.params;

    

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 28}}>{club.name}</Text>
            <Text style={{fontSize: 24}}>{club.description}</Text>
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