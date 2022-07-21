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
import { auth,fireDB } from '../firebase';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { IconButton, Snackbar } from 'react-native-paper';
// import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
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
    const { userId, name, avatar } = route.params;
    const loggedInUserId = auth.currentUser.uid;
    const [messages, setMessages] = useState([]);
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
                <Picker style={{ height: 20, width: 150 }}>
                    <Picker.Item label='View profile' > </Picker.Item>
                    <Picker.Item label='Delete chat '> </Picker.Item>
                </Picker>
            </View>

        );
    }


    function renderSend(props) {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <IconButton icon="send-circle" size={32} color="#009387" />
                </View>
            </Send>
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
    function refreshPage() {
        // window.location.reload(false);
        // DevSettings.reload();
        console.log("refresh");
    }
    //view profile and view profile photo in 3 dots, showimage mein true /false as boolean; kill gap between message and border and keep different colors for sender and receiver texts, clear chat
    // 009387
    useLayoutEffect(() => {
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
        console.log('chatId: ', chatId);
        setChatId(chatId);

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

        // setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

        arr.push(messages);
        for (let i = 0; i < arr.length; i++) {
            // console.log("element" + i + "=" + arr[i].Text);
            console.log(JSON.stringify(arr[i])._id);
            console.log(JSON.stringify(arr[i], null, 4));
        }
        const saveData = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
            } catch (e) {
                alert('Failed to save the data to the storage')
            }
        }

        saveData();

        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
                return jsonValue != null ? console.log(" retrieved value:" + JSON.parse(jsonValue)[1].user) : null;
            } catch (e) {
                // error reading value
            }
        }

        getData();

        console.log('messages: ', messages);

        let newChatId = await storeChat(chatId, messages[0], loggedInUserId);
        setChatId(newChatId);

        if (!chatId) {
            // store new chat id in both users location
            addChatId(userId, loggedInUserId, newChatId);
        }
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
            source={{ uri: 'https://res.cloudinary.com/practicaldev/image/fetch/s--WAKqnINn--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/tw0nawnvo0zpgm5nx4fp.png' }}
            style={{ flex: 1 }}
        >
            <GiftedChat


                // scrollToBottomComponent={scrollToBottomComponent}
                // renderActions={renderActions}
                scrollToBottom
                scrollToBottomComponent={scrollToBottomComponent}


                renderBubble={renderBubblefunc}

                // renderBubble={(props)=>{
                //         return <Bubble
                //         {...props}
                //         wrapperStyle={{
                //           right: {
                //             backgroundColor:"green",

                //           }

                //         }}
                //       />
                //     }}

                sendingContainer={InputBox}
                messagesContainerStyle={InputBox}


                onSend={messages => onSend(messages)}
                alwaysShowSend
                // textInputStyle={styles.composer}
                textInputStyle={InputBox}
                minComposerHeight={40}
                minInputToolbarHeight={60}
                messages={messages}
                showAvatarForEveryMessage={false}
                // renderSend={(props) => (
                //     <View style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
                //     {/* //   <BtnRound icon="camera" iconColor={Colors.red} size={40} style={{ marginHorizontal: 5 }} onPress={() => this.choosePicture()} /> */}

                //       <Send >
                //         <View style={styles.btnSend}>
                //           {/* <Ionicons name="ios-send" size={24} color="red" /> */}
                //           <Ionicons name="albums" size={40} color="red" />

                //         </View>
                //       </Send>




                //     </View>



                //   )}

                renderSend={renderSend}

                // onSend={messages => onSend(messages)}
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


});

export default Chat;
