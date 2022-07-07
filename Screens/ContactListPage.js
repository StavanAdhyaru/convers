import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import {
    Container,
    Card,
    UserInfo,
    UserImgWrapper,
    UserImg,
    UserInfoText,
    UserName,
    PostTime,
    MessageText,
    TextSection,
} from './Styles/MessageStyles';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
    Button,
    Dimensions, Image, FlatList, Menu
} from 'react-native';
const usersList = [
    {
        id: '1',
        userName: 'Stavan Doe',
        userImg: require('../assets/users/user-1.jpeg'),
        messageTime: '4 mins ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '2',
        userName: 'John Doe',
        userImg: require('../assets/users/user-2.jpeg'),
        messageTime: '2 hours ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '3',
        userName: 'Ken William',
        userImg: require('../assets/users/user-3.jpeg'),
        messageTime: '1 hours ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '4',
        userName: 'Selina Paul',
        userImg: require('../assets/users/user-4.jpeg'),
        messageTime: '1 day ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '5',
        userName: 'Christy Alex',
        userImg: require('../assets/users/user-8.jpeg'),
        messageTime: '2 days ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
];


const getRecepeintUserData = async () => {
    try {
        console.log("in getUserDataFromDB");
        let userId = auth.currentUser.uid;
        console.log(userId);
        let response = await fireDB.collection('users').doc(userId).get();
        console.log('userData: ', response.data());
        let userData = response.data();
        setData({
            ...userData
        })

    } catch (error) {
        console.log('error: ', error);

    }
}

const ContactListPage = ({ navigation, item }) => {

    const [dataFromState, setData] = useState(usersList)

    const searchName = (input)=> {
        let data = dataFromState;
        let searchData = data.filter((item) =>{
          return item.userName.toLowerCase().includes(input.toLowerCase())
        });
        setData(searchData)
        }

    return (

        <Container>
            <View>
                <TextInput
                    placeholder="Seach Friend"
                    onChangeText={(input) => {
                        searchName(input)
                    }}
                    style={{ fontSize: 18 }}
                />

            </View>
            <FlatList
                data={dataFromState}
                // keyExtractor={item => item.id}
                keyExtractor = {(item,index)=>index.toString()}
                renderItem={({item}) => (
                    <Card onPress={() => navigation.navigate('Chat', {receipentName: item.userName,receipentProfileImage: item.userImg})}>
                      <UserInfo>
                        <UserImgWrapper>
                          <UserImg source={item.userImg} />
                        </UserImgWrapper>
                        <TextSection>
                          <UserInfoText>
                            <UserName>{item.userName}</UserName>
                            <PostTime>{item.messageTime}</PostTime>
                          </UserInfoText>
                          <MessageText>{item.messageText}</MessageText>
                        </TextSection>
                      </UserInfo>
                    </Card>
                  )}
                />
              </Container>
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

export default ContactListPage;