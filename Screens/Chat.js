import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ImageBackground } from 'react-native';
import {
    UserImgWrapper,UserImg
} from './Styles/MessageStyles';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Chat = ({ route,navigation }) => {
    const [messages, setMessages] = useState([]);
    const arr = [];
    let STORAGE_KEY = "CHAT_DATA";
    const {receipentName,receipentProfileImage,currentuserId} = route.params;
    const currentUserData = route.params.currentUserData;



    useLayoutEffect(() => {
        navigation.setOptions({
            title: receipentName,
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <UserImgWrapper>
                    <UserImg source={{
                        uri: "https://firebasestorage.googleapis.com/v0/b/convers-5a5ea.appspot.com/o/images%2FCkMIUQ2zQ2Q3xasb2qjSY36bUfP2?alt=media&token=832fdb47-b188-476a-817f-b30dbf5272bc",
                    }} />
                    </UserImgWrapper>
                </View>
            )
        })
    }, [navigation]);

    useEffect(() => {
        console.log(receipentName);
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
              alert('Data successfully saved')
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
        
    }, []);
    console.log(messages);
    
    return (
        // <ImageBackground
        //     source={{
        //         uri:  "https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg"
        //     }}
        // >
        <GiftedChat
            textInputStyle={styles.composer}
            minComposerHeight={40}
            minInputToolbarHeight={60}
            messages={messages}
            messagesContainerStyle={{
                
            }}
            // parsePatterns={(linkStyle) => [
            //     { type: 'phone', style: linkStyle, onPress: this.onPressPhoneNumber },
            //     { pattern: /#(\w+)/, style: { ...linkStyle, styles.hashtag }, onPress: this.onPressHashtag }
            // ]}
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
                _id: currentuserId,
                name: currentUserData.name,
                avatar: currentUserData.profileImageUrl
            }}
        />
        // </ImageBackground>
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











// import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { GiftedChat } from 'react-native-gifted-chat';
 
// const Chat = ({ navigation }) => {
//    const [messages, setMessages] = useState([]);

//    useLayoutEffect(() => {
//        navigation.setOptions({
//            headerLeft: () => (
//                <View style={{ marginLeft: 20 }}>
//                </View>
//            ),
//            headerRight: () => (
//                <TouchableOpacity style={{
//                    marginRight: 10
//                }}
//                >
//                    <Text>logout</Text>
//                </TouchableOpacity>
//            )
//        })
//    }, [navigation]);
 
//    useEffect(() => {
//        setMessages([
//            {
//                _id: 1,
//                text: 'Hello developer',
//                createdAt: new Date(),
//                user: {
//                    _id: 2,
//                    name: 'React Native',
//                    avatar: 'https://placeimg.com/140/140/any',
//                },
//            },
//        ])
//    }, []);
//    const onSend = useCallback((messages = []) => {
//        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
//    }, []);
//    return (
//        <GiftedChat
//            messages={messages}
//            showAvatarForEveryMessage={true}
//            onSend={messages => onSend(messages)}
//            user={{
//                _id: 1,
//                name: "Stavan",
//                avatar: "https://placeimg.com/140/140/any",
//            }}
//        />
//    );
// }
 
// export default Chat;
