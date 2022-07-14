import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import HomePage from './Screens/HomePage';
import Registration from './Screens/registration';
import ForgotPasswordPage from './Screens/ForgotPasswordPage';
import Notification from './Screens/Notification';
import config from './QBConfig';
const Stack = createNativeStackNavigator();

const App = () => {

  // React.useEffect(() => {
  //   dispatch(appStart(config));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login">
      
      <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
      <Stack.Screen options={{ headerShown: false }} name="Home" component={HomePage} />
      <Stack.Screen options={{ headerShown: false }} name="Register" component={Registration} />
      <Stack.Screen options={{headerShown: false}} name= "ForgotPassword" component={ForgotPasswordPage}/>
      <Stack.Screen options={{headerShown: false}} name= "Notification" component={Notification}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;