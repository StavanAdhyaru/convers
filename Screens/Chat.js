import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
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
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
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
        console.log('messages: ', messages);
        let result = await storeChat(chatId, messages[0], loggedInUserId);
        setMessagesAfterSend(messages);
    }, []);

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: loggedInUserId,
                name: name,
                avatar: avatar
            }}
        />
    );
}

export default Chat;
