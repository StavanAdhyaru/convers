import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import HomePage from './Screens/HomePage';
import Registration from './Screens/Registration';
import ForgotPasswordPage from './Screens/ForgotPasswordPage';
const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen options={{ headerShown: false, headerBackButtonMenuEnabled: true }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomePage} />
        <Stack.Screen options={{ headerShown: false }} name="Register" component={Registration} />
        <Stack.Screen options={{ headerShown: false }} name="ForgotPassword" component={ForgotPasswordPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;