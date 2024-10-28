import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from './screens/HomeScreen'
import ClubStackScreen from './screens/ClubStack'


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Clubs") {
              iconName = "book"
            }

            return <Ionicons name={iconName} size={size} color={color} />;

          },
          tabBarActiveTintColor: 'lightblue',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "lightblue"
            },
            headerTintColor: "black",
            headerTitleStyle: {
              fontWeight: 'bold'
            },
          }} name="Home" component={HomeScreen} />
        <Tab.Screen options={{ headerShown: false }} name="Clubs" component={ClubStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
