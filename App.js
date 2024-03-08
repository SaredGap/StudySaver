import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './HomeScreen';
import FlashcardApp from './FlashcardApp';
import GastosScreen from './GastosScreen';
import GatosApps from './GatosApps';
import LoginScreen from './LoginScreen';


const Stack = createStackNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('isLoggedIn');
        const storedUsername = await AsyncStorage.getItem('username');
        setIsLoggedIn(value === 'true');
        setUsername(storedUsername || '');
      } catch (error) {
        console.error('Error al obtener el estado de inicio de sesión:', error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} username={username} />}
        </Stack.Screen>
        <Stack.Screen name="Flashcards" component={FlashcardApp} />
        <Stack.Screen name="Gastos" component={GastosScreen} />
        <Stack.Screen name="Gatos" component={GatosApps} />
        <Stack.Screen name="Login" component={LoginScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
