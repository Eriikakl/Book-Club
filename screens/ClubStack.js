import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClubsScreen from './ClubScreen';
import ClubDetailsScreen from './ClubDetails';
import CreateClubScreen from './CreateClub';

const Stack = createNativeStackNavigator();

export default function ClubsStackScreen() {
    return (
        <Stack.Navigator >
            <Stack.Screen name="Club" component={ClubsScreen} />
            <Stack.Screen options={{
                title: 'Details',
            }} name="ClubDetails" component={ClubDetailsScreen} />
            <Stack.Screen options={{
                title: 'New Book Club',
            }} name="CreateClub" component={CreateClubScreen} />
        </Stack.Navigator>
    );
}