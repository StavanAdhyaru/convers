import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ImageBackground } from 'react-native';
import {
    UserImgWrapper,UserImg
} from './Styles/MessageStyles';
import { Avatar } from 'react-native-elements';
import { signOut } from 'firebase/auth';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getChat, storeChat } from '../API/chat';
import { getUserDetails } from '../API/user';
import { auth } from '../firebase';

const Chat = ({ navigation, route }) => {
    const { userId, name, avatar } = route.params;
    const loggedInUserId = auth.currentUser.uid;
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [chatId, setChatId] = useState(null);
    const arr = [];
    let STORAGE_KEY = "CHAT_DATA";
    const {receipentName,receipentProfileImage,currentuserId} = route.params;
    const currentUserData = route.params.currentUserData;

    useEffect(() => {

        getMessages();
        // readUser();
        // setMessages([
        //     {
        //         _id: 1,
        //         text: 'Hello developer',
        //         createdAt: new Date(),
        //         user: {
        //             _id: 2,
        //             name: 'React Native',
        //             avatar: 'https://placeimg.com/140/140/any',
        //         },
        //     },
        // ])
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: receipentName,
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <UserImgWrapper>
                    <UserImg source={{
                        uri: receipentProfileImage,
                    }} />
                    </UserImgWrapper>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 10
                }}
                >
                    <Text></Text>
                </TouchableOpacity>
            )
        })
    }, [navigation]);

    const getMessages = async () => {

        let loggedInUser = await getUserDetails(loggedInUserId);
        console.log('loggedInUser: ', loggedInUser);
        setLoggedInUser(loggedInUser);
        let loggedInUserChats = loggedInUser.chatIds;

        let otherUser = await getUserDetails(userId);
        let otherUserChats = otherUser.chatIds;

        let chatId = loggedInUserChats.filter(value => otherUserChats.includes(value))[0];
        console.log('chatId: ', chatId);
        setChatId(chatId)

        let allMessages = await getChat(chatId);
        console.log('allMessages: ', allMessages);

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
        console.log('result: ', result);
        console.log('allMessages: ', allMessages);

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
        arr.push(messages);
        for(let i=0; i<arr.length; i++)
        {
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
            } catch(e) {
              // error reading value
            }
          }

          getData();
        
        console.log('messages: ', messages);
        let result = await storeChat(chatId, messages[0], loggedInUserId);
        setMessagesAfterSend(messages);
    }, []);

    return (
        <GiftedChat
            textInputStyle={styles.composer}
            minComposerHeight={40}
            minInputToolbarHeight={60}
            messages={messages}
            showAvatarForEveryMessage={true}
            enderSend={(props) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
                  {/* <BtnRound icon="camera" iconColor={Colors.red} size={40} style={{ marginHorizontal: 5 }} onPress={() => this.choosePicture()} /> */}
                  <Send>
                    <View style={styles.btnSend}>
                      <Ionicons name="ios-send" size={24} color="red" />
                    </View>
                  </Send>
                </View>
              )}
            onSend={messages => onSend(messages)}
            user={{
                _id: loggedInUserId,
                name: name,
                avatar: avatar
            }}
        />
    );
}

const styles = StyleSheet.create({
    composer:{
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
        borderRadius: 50
      }
 });

export default Chat;
