import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import ClubsScreen from './ClubScreen';
import ClubDetailsScreen from './ClubDetailsScreen';
import CreateClubScreen from './CreateClubScreen';
import BookRestApi from '../components/BookApi';
import ChatScreen from './ChatScreen';

const Stack = createNativeStackNavigator();

export default function ClubsStackScreen() {
    return (
        <Stack.Navigator >
            {/* List of Book Clubs */}
            <Stack.Screen name="Club" component={ClubsScreen}

                options={{
                    title: "Book Clubs",
                    headerStyle: {
                        backgroundColor: "#cfbaba"
                    },

                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                }} />

            {/* Details of Book Club */}
            <Stack.Screen name="ClubDetails" component={ClubDetailsScreen}
                options={{
                    title: 'Details',
                    headerStyle: {
                        backgroundColor: "#cfbaba"
                    },

                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                }} />

            {/* Create new Book Club -form */}
            <Stack.Screen name="CreateClub" component={CreateClubScreen}
                options={{
                    title: 'New Book Club',
                    headerStyle: {
                        backgroundColor: "#cfbaba"
                    },

                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                }} />

            {/* Search book for Book Club */}
            <Stack.Screen name="BookApi" component={BookRestApi}
                options={{
                    title: 'Search book',
                    headerStyle: {
                        backgroundColor: "#cfbaba"
                    },

                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                }} />

            {/* Chat for Book Club */}
            <Stack.Screen name="ChatScreen" component={ChatScreen}
                options={{
                    title: 'Chat',
                    headerStyle: {
                        backgroundColor: "#cfbaba"
                    },

                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                }} />
        </Stack.Navigator>
    );
}