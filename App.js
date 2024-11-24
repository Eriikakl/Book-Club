import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import HomeScreen from './screens/HomeScreen'
import ClubsStackScreen from './screens/ClubStack';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import { UserProvider } from './components/UserContext';
import { Provider as PaperProvider } from 'react-native-paper'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Tarkistetaan onko käyttäjä kirjautuneena
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // Käyttäjä on kirjautuneena
      } else {
        setIsLoggedIn(false); // Käyttäjä ei ole kirjautuneena
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <PaperProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {!isLoggedIn ? ( // Tarkistetaan kirjautumistila
              <Stack.Screen name="Login" options={{ headerShown: false }}>
                {() => <LoginScreen onLogin={() => setIsLoggedIn(true)} />}
              </Stack.Screen>
            ) : (
              <Stack.Screen name="Main" options={{ headerShown: false }}>
                {() => (
                  <Tab.Navigator
                    screenOptions={({ route }) => ({
                      tabBarIcon: ({ color, size }) => {
                        let iconName;

                        if (route.name === "Home") {
                          iconName = "home";
                        } else if (route.name === "Clubs") {
                          iconName = "book";
                        } else if (route.name === "Profile") {
                          iconName = "user";
                          return <Entypo name="user" size={size} color={color} />;
                        }


                        return <Ionicons name={iconName} size={size} color={color} />
                      },
                      tabBarActiveTintColor: '#695F5F',
                      tabBarInactiveTintColor: 'lightgray',
                    })}>
                    <Tab.Screen
                      name="Home"
                      component={HomeScreen}
                      options={{
                        headerShown: true,
                        headerStyle: {
                          backgroundColor: "#cfbaba",
                        },
                        headerTintColor: "black",
                        headerTitleStyle: {
                          fontWeight: 'bold',
                        },
                      }}
                    />
                    <Tab.Screen
                      name="Clubs"
                      component={ClubsStackScreen}
                      options={{ headerShown: false }}
                    />
                    <Tab.Screen
                      name="Profile"
                      component={ProfileScreen}
                      options={{
                        headerShown: true,
                        headerStyle: {
                          backgroundColor: "#cfbaba",
                        },
                        headerTintColor: "black",
                        headerTitleStyle: {
                          fontWeight: 'bold',
                        },
                      }}
                    />
                  </Tab.Navigator>
                )}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </PaperProvider>
  );
}
