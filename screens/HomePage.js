import {
    StyleSheet,
    Dimensions
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsPage from './SettingsPage';
import ContactListPage from './ContactListPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import Chat from './Chat';
import ChangePasswordScreen from './ChangePassword';
import Registration from './registration';

const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomePage = ({ navigation }) => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Tab"
                    component={TabStackNavigator}
                    options={{ headerShown: false }} />
                <Stack.Screen options={{headerShown:false}} name="Log" component={Login} />
                <Stack.Screen options={{headerShown:false}} name="CP" component={ChangePasswordScreen}/>
                <Stack.Screen options={{headerShown:false}} name="Home" component={HomePage}/>
                <Stack.Screen name="Chat" component={Chat}/>
                <Stack.Screen options={{headerShown:false}} name="Register" component={Registration}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const TabStackNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'ContactListPage') {
                        iconName = focused
                            ? 'chatbubbles'
                            : 'chatbubbles-outline';
                    } else if (route.name === 'SettingsPage') {
                        iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#009387',
                tabBarInactiveTintColor: 'gray',
            })}>
            <Tab.Screen options={{title:'Chats', headerTintColor:'#009387'}} name="ContactListPage" component={ContactListPage} />
            <Tab.Screen options={{headerShown:false, title:'Settings'}} name="SettingsPage" component={SettingsPage} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        alignItems: 'center',
        marginTop: 25
    },
    signIn: {
        width: 340,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default HomePage;
