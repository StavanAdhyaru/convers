import { auth, fireDB } from "../firebase";
import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {
    StyleSheet,
    Dimensions,AppState, SnapshotViewIOS 
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
import ForgotPasswordPage from './ForgotPasswordPage';
import {setUserStatus,getSingleUserData,getMultipleChats, savePushNotificationToken} from '../API/user'
import { UserImg } from "./Styles/MessageStyles";
import {getContactslist} from "../API/contacts";
import { Snackbar } from "react-native-paper";
import OtherUserDetailsPage from "./OtherUserDetailsPage";
import AddContact from "./addContact";
import CreateGroupName from "./CreateGroupName";
import AddPeopleInGroup from "./AddPeopleInGroup";
const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const HomePage = ({ navigation,route }) => {
    const [expoPushToken, setExpoPushToken] = useState('');

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [contacts, setContacts] = useState([]);
    let userId = auth.currentUser.uid;


    const [currentUserData, setData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        profileImageUrl: '',
        status: true,
        pushToken: ''
    });
    const [currentUserId,setId] = useState('')
    
    useEffect(() => {
        
        console.log("in useEffect");
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        getContactslist();
        getUserDataFromDB();
        // const chatIdWithUserId = await getMultipleChats();
        // console.log(chatIdWithUserId);
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (
              appState.current.match(/inactive|background/) &&
              nextAppState === "active"
            ) {
              console.log("App has come to the foreground!");
              setUserStatus
            }
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log("AppState", appState.current);
            
            if(appState.current == "active"){
                console.log("Here for updating userStatus")
                setUserStatus(userId,currentUserData,true);
            }else{
                setUserStatus(userId,currentUserData,false);
            }
            return () => {
                subscription.remove();
              };

          });
    }, [])



    const getUserDataFromDB = async () => {
        try {
            console.log("in getUserDataFromDB");
            // let userId = auth.currentUser.uid;
            console.log(userId);
            setId(userId);
            let response = await fireDB.collection('users').doc(userId).get();
            // fireDB.collection('users').doc(userId).onSnapshot(snapshot => {
            //     // console.log("snapshot:",snapshot.get())
            //     updateCurrentUserDetails(snapshot.data);
            // })
            console.log('userData: ', response.data());
            let userData = response.data();
            setData({
                ...userData
            })

            console.log("Here first");
        } catch (error) {
            console.log('error: ', error);
        }
    }

    

    const registerForPushNotificationsAsync = async () => {
        console.log("registering for push notification");
        let token;
        if (Device.isDevice) {
          // check for existing permissions
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          // if no existing permission , ask user for permission
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          // if no permission , exit the function
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
      
          // get push notification token
          token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(token);

          if(token) {
              // save it to users database
              savePushNotificationToken(currentUserId, token)
          }
          
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        return token;
      }
   
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
                <Stack.Screen option={{headerStyle: {height: 70}}} initialParams={{currentUserData: currentUserData,currentUserId: currentUserId}} name="Chat" component={Chat}/>
                <Stack.Screen options={{headerShown:false}} name="Register" component={Registration}/>
                <Stack.Screen options={{headerShown:false}} name="ForgotPassword" component={ForgotPasswordPage}/>
                <Stack.Screen options={{headerShown:false}} name="OtherUserDetails" component={OtherUserDetailsPage}/>
                <Stack.Screen options={{headerShown:true}} name="AddContact" component={AddContact}/>
                <Stack.Screen options={{headerShown:false}} name="CreateGroupName" component={CreateGroupName}/>
                <Stack.Screen options={{headrerShown:false}}name="AddPeopleInGroup" component={AddPeopleInGroup}/>
                
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
            <Tab.Screen  options={{title:'Chats', headerTintColor:'#009387',headerBackButtonMenuEnabled:true}} name="ContactListPage" component={ContactListPage} />
            <Tab.Screen  options={{headerShown:false, title:'Settings',headerBackButtonMenuEnabled:true,topBar:{
                backButton:{},
            }}} name="SettingsPage" component={SettingsPage} />
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
