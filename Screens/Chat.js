import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import {
    UserImgWrapper, UserImg
} from './Styles/MessageStyles';
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat';

import Icon from 'react-native-vector-icons/FontAwesome5';

import { getChat, storeChat } from '../API/chat';
import { addChatId } from '../API/user';
import { auth, fireDB, storage } from '../firebase';
import { IconButton, Snackbar } from 'react-native-paper';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from "@react-navigation/native";


import {
    FontAwesome5,
    Entypo,
    
} from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';


const Chat = ({ navigation, route }) => {
    const isFocused = useIsFocused();
    const { userId, name, avatar, chatId } = route.params;
    const loggedInUserId = auth.currentUser.uid;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState([]);
    const [photo, setPhoto] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({
        name: '',
        email: '',
        contactNumber: '',
        profileImageUrl: '',
        status: false,
        pushToken: ''
    });
    // const [newChatId, setChatId] = useState(null);
    const [sendersToken, setSendersToken] = useState("");
    const [receiversToken, setReceiversToken] = useState("");
    const { receipentName, receipentProfileImage, currentuserId, } = route.params;
    const isGroup = route.params.isGroup;
    const image = { uri: "https://reactjs.org/logo-og.png" };
    const [receipentData,setReceipentData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        profileImageUrl: '',
        status: false,
        pushToken: ''
    });
    const [receipentStatus,setReceipentStatus] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [groupData,setGroupData] = useState({
        name: '',
        profileImageUrl: '',
        usersList: [],
        chatId: ''
    });

    // const onResult = (querySnapshot) => {
    //     let allChats = [];
    //     const messagesFromFirestore = querySnapshot.docChanges().map(({doc}) => {
    //         let message = doc.data();
    //         message._id = doc.id;
    //         message.createdAt = message.createdAt.toDate();
    //         allChats.push(message);
            
    //     })
    //     allChats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    //     let userDetails = {
    //         [loggedInUserId]: {
    //             name: loggedInUser.name,
    //             avatar: loggedInUser.profileImageUrl
    //         },
    //         [userId]: {
    //             name: receipentData.name,
    //             avatar: receipentData.profileImageUrl
    //         }
    //     }

    //     let result = allChats.forEach((message) => {
    //         message["user"] = {
    //             _id: message.userId,
    //             ...userDetails[message.userId],
    //         }
    //         delete message.userId
    //     })

    //     setMessages(allChats);
    // }

    // const onError = (error) => {
    //     console.log('error: ', error);

    // }

    useEffect(() => {

        console.log("Is a group", isGroup);
        // getRecepientDataFromDb();


        try{
            if(isGroup){
                console.log("User Id at Chat.js ",userId)
                fireDB.collection('groups').doc(userId).onSnapshot((snapshot) => {
                    let gData = snapshot.data();
                    setGroupData({
                        ...gData
                    })
                });
            }else{
                fireDB.collection('users').doc(userId).onSnapshot((snapshot) => {
                   
                        let userData = snapshot.data();
                        console.log("Getting data of other user here first: ",snapshot.data());
                        setReceipentData({
                            ...userData
                        })
                        console.log("setting recepient Status")
                        setReceipentStatus(receipentData.status);
                        setReceiversToken(userData.pushToken);
                });
            }
        }catch(error){
            console.log(error);
        }










        const unsubscribe = fireDB.collection('chats').doc(chatId).collection('chatData').onSnapshot(async (querySnapshot) => {
            let allChats = [];
            let response = await getChat(chatId);
            // allChats.push(response);
            querySnapshot.docChanges().map(async ({doc}) => {
                let message = doc.data();
                message._id = doc.id;
                message.createdAt = message.createdAt.toDate();
                allChats.push(message);
                
            })
            allChats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            let userDetails = {
                [loggedInUserId]: {
                    name: loggedInUser.name,
                    avatar: loggedInUser.profileImageUrl
                },
                [userId]: {
                    name: receipentData.name,
                    avatar: receipentData.profileImageUrl
                }
            }

            if(allChats.length === 1) {
                allChats = [...response, ...allChats];
            }

            allChats.forEach((message) => {
                message["user"] = {
                    _id: message.userId,
                    ...userDetails[message.userId],
                }
                delete message.userId
            })
            console.log('allChats: ', allChats);
            setMessages(allChats);

        });

        return () => unsubscribe();

        // getMessages();
    }, [isFocused]);

    useLayoutEffect(() => {
        // getMessages();

        console.log('receipentName: ', receipentName);
        navigation.setOptions({
            title: "",
            headerStyle: { backgroundColor: '#009387' },
            headerLeft: () => (
                <View style={{ flexDirection: 'row' }}>
                    <UserImgWrapper>
                        {
                            console.log("Chat Id while sending",chatId)
                        }
                        <TouchableOpacity onPress={() => {
                            if(!isGroup){
                                navigation.navigate("OtherUserDetails",{
                                    otherUserId: userId,
                                    chatId: chatId
                                })
                            }else{
                                navigation.navigate("GroupProfile",{
                                    groupId: userId,
                                    chatId: chatId,
                                    groupData: groupData
                                });
                            }
                            }
                        
                        }>
                        <UserImg style={{ margin: 0 }} source={{
                            uri: receipentProfileImage,
                        }} />
                        </TouchableOpacity>
                    </UserImgWrapper>
                    <View style={{flexDirection: 'column', margin: 20}}>
                        <Text style={{fontSize: 22, fontWeight: '600'}}>{receipentName}</Text>
                        {receipentData.status ?
                            <Text style={{marginTop: 5}}>Online</Text> :
                            <Text></Text>
                        }
                    </View>
                </View>

            ),
            // headerRight: () => (
            //     <View style={{
            //         // flexDirection: 'row',
            //         // justifyContent: 'space-between'
            //     }}>
            //     {
            //         console.log("recepient status",receipentData.status)
            //     }   
            //     {receipentData.status ?
            //         <Text style={{ marginTop: 25, marginRight: 140 }}>Online</Text> :
            //         <Text></Text>
            //     }

            //     </View>
            // )
        })
    }, [navigation]);
    

    const randGen = () => {

        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var result = ""
        var charactersLength = characters.length;

        for ( var i = 0; i < 5 ; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;

    }

    const getDownloadURL = async (randVar) => {
        try {
            let tempUrl = await storage.ref("/images/sharePhotos/").child(`${chatId}`).child(`${randVar}`).getDownloadURL();
            setIsImage(true)
            return tempUrl;
            
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
                imgURI=result.uri;
                setPhoto(result);

                let randVarInSendPhoto = randGen();

                // upload photo
                uploadPhoto(result,randVarInSendPhoto).then(async () => {
                    console.log('image uploaded');
                    // get URL after uploading
                    let imageUrl = await getDownloadURL(randVarInSendPhoto);
                    console.log('imageUrl: ', imageUrl);
                    setImageUrl(imageUrl);
                    // setIsImage(true);
                    // store chat
                    onSend([{image: imageUrl}]);


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

    const getRecepientDataFromDb = async () => {
        try{
            if(isGroup){
                console.log("User Id at Chat.js ",userId)
                let response = await fireDB.collection('groups').doc(userId).get();
                console.log('group data found in Chat.js', response.data());
                let gData = response.data();
                setGroupData({
                    ...gData
                })
                console.log(groupData);


            }else{
                let response = await fireDB.collection('users').doc(userId).get();
                console.log('userData: ', response.data());
                let userData = response.data();
                setReceipentData({
                    ...userData
                })
                console.log("setting recepient Status")
                setReceipentStatus(receipentData.status);
                setReceiversToken(userData.pushToken);
            }
            

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

    const setMessagesAfterSend = (messages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }

    const notifyUser = async (name, token, message) => {
        console.log('name, token, message: ', name, token, message);
        try {
            let response = await axios.post("https://exp.host/--/api/v2/push/send", {
                "to": token,
                "title" : `Convers - ${name}`,
                "body": message
            }, {
                headers: {
                    "host": "exp.host",
                    "accept": "application/json",
                    "accept-encoding": "gzip, deflate",
                    "content-type": "application/json"
                }
            })
            
        } catch (error) {
            console.log('error: ', error);
            
        }
    }

    const onSend = useCallback(async (messages = []) => {
        console.log('messages: ', messages);

        // let chatId = await getChatId(loggedInUserId, userId);
        if(chatId) {
            console.log('chatId on send: ', chatId);
            // setChatId(chatId);
    
    
            console.log('isImage: ', isImage, messages[0].image);
            if(messages[0].image){
                setIsImage(true)
                console.log('isImage: ', isImage);
                messages[0].createdAt = new Date();
            } else {
                setIsImage(false);
                console.log('isImage: ', isImage);
            }
        }

        let newChatId = await storeChat(chatId, messages[0], loggedInUserId, isImage);
        if(!chatId) {
            console.log('newChatId: ', newChatId);
            // setChatId(newChatId);
            chatId = newChatId;
            await addChatId(userId, loggedInUserId, newChatId);
        }

        if(isImage) {
            messages[0]._id = "1",
            messages[0].user = {
                _id: loggedInUserId,
                name: name,
                avatar: avatar
            }

        }

        console.log('messages: ', messages);
        // setNewMessage(messages);
        setMessagesAfterSend(messages);

        // notify other user
        notifyUser( loggedInUser.name, receiversToken, messages[0].text);


    }, []);

    const renderBubblefunc = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#009387',
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
            resizeMode='cover'
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
