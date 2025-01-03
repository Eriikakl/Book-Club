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
import { Provider as PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { Barlow_400Regular, Barlow_700Bold } from '@expo-google-fonts/barlow';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


export default function App() {
  useFonts({
    Barlow_400Regular,
    Barlow_700Bold,
  });

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
                    lazy={false}
                    screenOptions={({ route }) => ({
                      tabBarIcon: ({ color, size }) => {
                        let iconName;

                        if (route.name === "Koti") {
                          iconName = "home";
                        } else if (route.name === "Lukupiirit") {
                          iconName = "book";
                        } else if (route.name === "Profiili") {
                          iconName = "user";
                          return <Entypo name="user" size={size} color={color} />;
                        }


                        return <Ionicons name={iconName} size={size} color={color} />
                      },
                      tabBarActiveTintColor: '#695F5F',
                      tabBarInactiveTintColor: 'lightgray',
                      tabBarActiveBackgroundColor: '#fafaf7',
                      tabBarInactiveBackgroundColor: '#fafaf7'
                    })}>
                    <Tab.Screen
                      name="Koti"
                      component={HomeScreen}
                      options={{
                        headerShown: true,
                        headerStyle: {
                          backgroundColor: "#cfbaba",
                        },
                        headerTintColor: "black",
                        headerTitleStyle: {
                          fontFamily: 'Barlow_700Regular'
                        },
                      }}
                    />
                    <Tab.Screen
                      name="Lukupiirit"
                      component={ClubsStackScreen}
                      options={{ headerShown: false }}
                    />
                    <Tab.Screen
                      name="Profiili"
                      component={ProfileScreen}
                      options={{
                        headerShown: true,
                        headerStyle: {
                          backgroundColor: "#cfbaba",
                        },
                        headerTintColor: "black",
                        headerTitleStyle: {
                          fontFamily: 'Barlow_700Regular'
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
