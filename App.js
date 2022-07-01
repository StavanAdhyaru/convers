import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import HomePage from './screens/HomePage';
import Registration from './screens/registration';
import ForgotPasswordPage from './screens/ForgotPasswordPage';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login">
      
      <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
      <Stack.Screen options={{ headerShown: false }} name="Home" component={HomePage} />
      <Stack.Screen options={{ headerShown: false }} name="Register" component={Registration} />
      <Stack.Screen options={{headerShown: false}} name= "ForgotPassword" component={ForgotPasswordPage}/>
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