import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
 
const Chat = ({ navigation }) => {
   const [messages, setMessages] = useState([]);

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
                   <Text>logout</Text>
               </TouchableOpacity>
           )
       })
   }, [navigation]);
 
   useEffect(() => {
       setMessages([
           {
               _id: 1,
               text: 'Hello developer',
               createdAt: new Date(),
               user: {
                   _id: 2,
                   name: 'React Native',
                   avatar: 'https://placeimg.com/140/140/any',
               },
           },
       ])
   }, []);
   const onSend = useCallback((messages = []) => {
       setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
   }, []);
   return (
       <GiftedChat
           messages={messages}
           showAvatarForEveryMessage={true}
           onSend={messages => onSend(messages)}
           user={{
               _id: 1,
               name: "Stavan",
               avatar: "https://placeimg.com/140/140/any",
           }}
       />
   );
}
 
export default Chat;
