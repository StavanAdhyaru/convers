import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import HomePage from './screens/HomePage';
import Registration from './screens/registration';
import SettingsPage from './screens/SettingsPage';
import Chat from './screens/Chat';
import UploadProfilePicture from './screens/profilePicture';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen options={{ headerShown: true }} name="Register" component={Registration} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomePage} />
        <Stack.Screen options={{ headerShown: false }} name="Settings" component={SettingsPage} />
        <Stack.Screen  name="Chat" component={Chat} />
        <Stack.Screen options={{ headerShown: false }} name="UploadProfilePicture" component={UploadProfilePicture} />
      </Stack.Navigator>
    </NavigationContainer>
  )
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