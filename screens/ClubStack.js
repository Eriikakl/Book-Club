import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import ClubsScreen from './ClubScreen';
import ClubDetailsScreen from './ClubDetails';
import CreateClubScreen from './CreateClub';

const Stack = createNativeStackNavigator();

export default function ClubsStackScreen({ navigation }) {
    return (
        <Stack.Navigator >
            {/* List of Book Clubs */} 
            <Stack.Screen name="Club" component={ClubsScreen}

                options={{
                    title: "Book Clubs",
                    headerStyle: {
                        backgroundColor: "lightblue"
                    },

                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },

                    headerRight: () => (
                        <Button
                            onPress={() => navigation.navigate('CreateClub')}
                            title="Create new"
                            color="#666"
                        />

                    ),
                }} />

            {/* Details of Book Club */} 
            <Stack.Screen name="ClubDetails" component={ClubDetailsScreen}
             options={{
                title: 'Details',
                headerStyle: {
                    backgroundColor: "lightblue"
                },

                headerTintColor: "black",
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
            }}  />

            {/* Create new Book Club -form */} 
            <Stack.Screen name="CreateClub" component={CreateClubScreen} 
            options={{
                title: 'New Book Club',
                headerStyle: {
                    backgroundColor: "lightblue"
                },

                headerTintColor: "black",
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
            }}  />
        </Stack.Navigator>
    );
}