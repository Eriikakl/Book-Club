import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
                    title: "Lukupiirit",
                    headerStyle: {
                        backgroundColor: "#cfbaba"
                    },

                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontFamily: 'Barlow_700Regular'
                    },
                }} />

            {/* Details of Book Club */}
            <Stack.Screen name="ClubDetails" component={ClubDetailsScreen}
                options={{
                    title: 'Lukupiiri',
                    headerStyle: {
                        backgroundColor: "#cfbaba"
                    },

                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontFamily: 'Barlow_700Regular'
                    },
                }} />

            {/* Create new Book Club -form */}
            <Stack.Screen name="CreateClub" component={CreateClubScreen}
                options={{
                    title: 'Uusi lukupiiri',
                    headerStyle: {
                        backgroundColor: "#cfbaba"
                    },

                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontFamily: 'Barlow_700Regular'
                    },
                }} />

            {/* Search book for Book Club */}
            <Stack.Screen name="BookApi" component={BookRestApi}
                options={{
                    title: 'Etsi kirja',
                    headerStyle: {
                        backgroundColor: "#cfbaba"
                    },

                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontFamily: 'Barlow_700Regular'
                    },
                }} />

            {/* Chat for Book Club */}
            <Stack.Screen name="ChatScreen" component={ChatScreen}
                options={{
                    title: 'Keskustelu',
                    headerStyle: {
                        backgroundColor: "#cfbaba"
                    },

                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontFamily: 'Barlow_700Regular'
                    },
                }} />
        </Stack.Navigator>
    );
}