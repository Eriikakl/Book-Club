import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from './screens/Home'
import ClubScreen from './screens/Club'


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size}) => {
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
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Clubs" component={ClubScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
