import React, { useEffect, useCallback, useState, useLayoutEffect, FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, TextInput,DevSettings } from 'react-native';
import {
    UserImgWrapper, UserImg
} from './Styles/MessageStyles';
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createChat, getChat, storeChat } from '../API/chat';
import { getUserDetails, addChatId, getChatId } from '../API/user';
import { auth, fireDB, storage } from '../firebase';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { IconButton, Snackbar } from 'react-native-paper';
// import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
// import { encryption, decryption } from '../API/AES';
// import ImagePicker from 'react-native-image-picker';
// import * as ImagePicker from 'expo-image-picker';


import {
    MaterialCommunityIcons,
    MaterialIcons,
    FontAwesome5,
    Entypo,
    Fontisto,
} from '@expo/vector-icons';
import Font from 'expo';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { encryption,decryption } from '../API/AES';
// import { HeaderBackButton } from 'react-navigation';

const Chat = ({ navigation, route }) => {
    const currentUser = auth.currentUser;

    const { userId, name, avatar } = route.params;
    const loggedInUserId = auth.currentUser.uid;
    const [messages, setMessages] = useState([]);
    const [photo, setPhoto] = useState('');
    const [url, setUrl] = useState('');

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: '',
        address: '',
        profileImageUrl: '',
        check_nameInputChange: false,
        check_emailInputChange: false,
        check_passwordInputChange: false,
        check_confirmPasswordInputChange: false,
        check_contactNumberInputChange: false,
        check_addressInputChange: false,
        secureTextEntry: true,
        securePasswordEntry: true,
    });

    const randGen = () => {

        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
var result = ""
var charactersLength = characters.length;

for ( var i = 0; i < 5 ; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
}

return result;

    }
    


    const [user, setUser] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [chatId, setChatId] = useState(null);
    const arr = [];
    let STORAGE_KEY = "CHAT_DATA";
    const { receipentName, receipentProfileImage, currentuserId } = route.params;
    const currentUserData = route.params.currentUserData;
    const image = { uri: "https://reactjs.org/logo-og.png" };
    const [receipentData,setReceipentData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        profileImageUrl: '',
        status: false
    });
    const [receipentStatus,setReceipentStatus] = useState(false);


    const [tempimpurl, settempimpurl] = useState("");
    const [boolvar, setboolvar] = useState(false);

    
    const getDownloadURL = async (randVar) => {
        try {

            // ("images/sharePhotos/").child(`${chatId}`)

            let tempUrl = await storage.ref("/images/sharePhotos/").child(`${chatId}`).child(`${randVar}`).getDownloadURL().then(() => {

                settempimpurl(tempUrl);


            });


            setboolvar(true);
            console.log(' retrieved url of image message : ', tempUrl);
            console.log('type of url:  ', typeof(tempUrl));
            console.log('value of url variable is:', url);

            storeChat(chatId, messages, loggedInUserId);
            console.log('stored/sent messages are:  ',messages);

            
            
        } catch (error) {
            console.log('error in getDownloadURL function : ', error);
            
        }
    }

     
        
        const uploadPhoto = (image, randVar) => {
        return new Promise( async (resolve, reject) => {
            try {
                console.log('image argument:: ', image.uri);
                const response = await fetch(image.uri)
                const blob = await response.blob();


                var ref = storage.ref("/images/sharePhotos/").child(`${chatId}`).child(`${randVar}`);
                console.log("_____________________LOADING...____________________");
                resolve(ref.put(blob));

                
                
            } catch (error) {
                console.log('error: ', error);
                reject(error);
            }
        })
    }

    //images/sharePhotos/chatId/image

    const sendPhoto = async () => {
        try {
            
            let imgURI = null;

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                base64: true,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
              });
          
            if (!result.cancelled) {  
                console.log('result (image uri): ', result.uri);
                imgURI=result.uri;
                setPhoto(result);

                let randVarInSendPhoto = randGen();

                uploadPhoto(result,randVarInSendPhoto).then(async () => {
                    console.log('await getDownloadURL  started ');
                    await getDownloadURL(randVarInSendPhoto);
                    console.log('getDownloadURL finished');
                    alert("Image uploaded!")
                    console.log('image uploaded');
                }).catch((error) => {
                    alert("Could not upload Image.");
                    console.log('error in uploading: ', error);

                })
    
            }


        } catch (error) {
            console.log('error: ', error);
            
        }
    }

    
    function InputBox() {
        return (
            <View style={styles.inputcontainer}>
                <View style={styles.inputmaincontainer}>
                    <FontAwesome5 name="laugh-beam" size={24} color="grey" />
                    <Entypo name="attachment" size={24} color="grey" style={styles.icon} />
                </View>
            </View>
        );
    }

    

    function testpress() {
        console.log("dots pressed");
        
        return (
            <View>
                <Picker style={{ height: 20, width: 150 }} mode={DropDownPicker}>
                    <Picker.Item label='View profile' > </Picker.Item>
                    <Picker.Item label='Delete chat '> </Picker.Item>
                </Picker>

                

            </View>

        );
    }


    function renderSend(props) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
      <Icon name="camera"  size={32} style={{ marginHorizontal: 5 }} onPress={sendPhoto} />
      <Send {...props}>
        <View style={styles.btnSend2}>
        <IconButton icon="send-circle" size={32} color="#009387" />

          {/* <Icon name="ios-send" size={24} color='#6646ee' /> */}
        </View>
      </Send>
    </View>
        );
    }

    const scrollToBottomComponent = () => {
        return (
            <FontAwesome5 name='angle-double-down' size={22} color='#333' />
        );
    }

    useEffect(() => {

        getRecepientDataFromDb();
        getMessages();
       
        
    }, []);

    const getRecepientDataFromDb = async () => {
        try{
            let response = await fireDB.collection('users').doc(userId).get();
            console.log('userData: ', response.data());
            let userData = response.data();
            setReceipentData({
                ...userData
            })
            console.log("setting recepient Status")
            setReceipentStatus(receipentData.status);
        }catch(error){
            console.log(error);
        }

        // try{
        //     fireDB.collection('users').doc(userId).onSnapshot(snapshot =>  {
        //         console.log("getting receipent data",snapshot.data())
        //         updateRecepientData(snapshot.data())
        //     })
        // }catch(error){
        //     console.log(error);
        // }
    }

    const updateRecepientData = (data) =>  {
        setReceipentData({
            ...data
        })
    }
    
    //view profile and view profile photo in 3 dots, showimage mein true /false as boolean; kill gap between message and border and keep different colors for sender and receiver texts, clear chat
    // 009387
    
    useLayoutEffect(() => {
        getMessages();

        console.log('receipentName: ', receipentName);
        navigation.setOptions({
            title: receipentName,
            // title: () => (
            //     <View>
            //         <TouchableOpacity>
            //             <Text style={{textDecorationColor: red}}>{receipentName}</Text>
            //         </TouchableOpacity>
            //     </View>
            // ),
            // topBar: {
            //     title   : receipentName
            // },
            headerStyle: { backgroundColor: '#009387' },
            headerLeft: () => (
                <View style={{ marginLeft: 5, flexDirection: 'row' }}>
                    <UserImgWrapper>
                        <TouchableOpacity onPress={() => {navigation.navigate("OtherUserDetails",{
                            otherUserData: receipentData
                        })}}>
                        <UserImg style={{ marginRight: 20 }} source={{
                            uri: receipentProfileImage,
                        }} />
                        </TouchableOpacity>
                    </UserImgWrapper>
                </View>

            ),
            headerRight: () => (
                <View style={{
                    flexDirection: 'row',

                    justifyContent: 'space-between',
                    marginRight: 10,

                }}>
                    {/* <Text>{receipentName}</Text> */}
                {
                    console.log("recepient status",receipentData.status)
                }
                    {receipentData.status ? 
                        
                        <Text style={{ marginTop: 35, width: 100, marginRight: 140 }}>Online</Text> :
                        <Text style={{ marginTop: 35, width: 100, marginRight: 140 }}></Text>
                        }

                    <TouchableOpacity onPress={testpress}>
                        <MaterialCommunityIcons style={{ marginTop: 5 }} name="dots-vertical" size={36} color={'white'} />

                    </TouchableOpacity>


                </View>
            )
        })
    }, [navigation]);

    const getMessages = async () => {

        let loggedInUser = await getUserDetails(loggedInUserId);
        setLoggedInUser(loggedInUser);
        let otherUser = await getUserDetails(userId);
        let chatId = await getChatId(loggedInUserId, userId);
        console.log('chatId get messages: ', chatId);
        setChatId(chatId);
        console.log('chatId: ', chatId);


        let allMessages = await getChat(chatId);
        // console.log('allMessages: ', allMessages);

        let userDetails = {
            [loggedInUserId]: {
                name: loggedInUser.name,
                avatar: loggedInUser.profileImageUrl
            },
            [userId]: {
                name: otherUser.name,
                avatar: otherUser.profileImageUrl
            }
        }

        let result = allMessages.forEach((message) => {
            message["user"] = {
                _id: message.userId,
                ...userDetails[message.userId]
            }
            delete message.userId
        })

        setMessages(allMessages);

    }

    const readUser = async () => {
        let user = await getUserDetails(userId);
        console.log('user: ', user);
        setUser(user);
    }

    const setMessagesAfterSend = (messages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }

    const onSend = useCallback(async (messages = []) => {

        let chatId = await getChatId(loggedInUserId, userId);
        console.log('chatId on send: ', chatId);
        setChatId(chatId);

        console.log('onsend called');
        console.log('value of image url variable tempimpurl is:  ', tempimpurl);
        console.log('value of boolean variable boolvar is:  ', boolvar);

        if (boolvar == true)
        {
            setMessages(tempimpurl);
            boolvar = false;
        }

        
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

        console.log('messages: ', messages);   

        let newChatId = await storeChat(chatId, messages[0], loggedInUserId);
        console.log('newChatId: ', newChatId);

        setMessagesAfterSend(messages);
    }, []);

    const renderBubblefunc = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: 'green',
                    },
                }}
                textStyle={{
                    right: {
                        color: 'white',
                    },
                }}
            />
        );

    };





    return (
        <ImageBackground
            source={require('../assets/wapp_background.jpeg')}
            style={{ flex: 1 }}
        >
            <GiftedChat


                scrollToBottom
                scrollToBottomComponent={scrollToBottomComponent}


                renderBubble={renderBubblefunc}

                

                sendingContainer={InputBox}


                onSend={messages => onSend(messages)}
                alwaysShowSend
                minComposerHeight={40}
                minInputToolbarHeight={60}
                messages={messages}
                showAvatarForEveryMessage={false}
                

                renderSend={renderSend}



                user={{
                    _id: loggedInUserId,
                    name: name,
                    avatar: avatar
                }}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    composer: {
        borderRadius: 25,
        borderWidth: 0.5,
        borderColor: '#dddddd',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        fontSize: 16
    },
    btnSend: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderRadius: 50,
        color: '#6646ee',


    },
    btnIcon: {
        height: 3,
        width: 3,
    },

    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    inputcontainer: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'flex-end',
    },
    inputmaincontainer: {
        flexDirection: 'row',
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 25,
        marginRight: 10,
        flex: 1,
        alignItems: 'flex-end',
    },
    textInput: {
        flex: 1,
        marginHorizontal: 10
    },

    btnSend2: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        
        borderRadius: 50
      }


});

export default Chat;
