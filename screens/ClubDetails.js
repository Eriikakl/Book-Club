import { View, Text, StyleSheet } from 'react-native';


export default function ClubDetailsScreen({ route }) {
    const { club } = route.params;

    

    return (
        <View style={styles.container}>
            <Text>{club.name}</Text>
            <Text>{club.description}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});