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
import { getUserDetails, getAllUsers } from '../API/user';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';

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


// const getRecepeintUserData = async () => {
//     try {
//         console.log("in getUserDataFromDB");
//         let userId = auth.currentUser.uid;
//         console.log(userId);
//         let response = await fireDB.collection('users').doc(userId).get();
//         console.log('userData: ', response.data());
//         let userData = response.data();
//         setData({
//             ...userData
//         })

//     } catch (error) {
//         console.log('error: ', error);

//     }
// }

const ContactListPage = ({navigation, item}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const currentUserId = auth.currentUser.uid;
    const [dataFromState, setData] = useState(usersList)

    const searchName = (input)=> {
        let data = dataFromState;
        let searchData = data.filter((item) =>{
          return item.userName.toLowerCase().includes(input.toLowerCase())
        });
        setData(searchData)
        }

    useEffect(() => {
        readUser();
        getAllUsersFromDB();
    },[]);
    
    const readUser = async () => {
        const user = await AsyncStorage.getItem('user');
        if(user) {
            console.log('user: ', JSON.parse(user));
            setCurrentUser(JSON.parse(user));
        } else {
            const getUser = await getUserDetails(currentUserId)
            await AsyncStorage.setItem('user', JSON.stringify(getUser));
            setCurrentUser(getUser);
        }
    }

    const getAllUsersFromDB = async () => {
        let tempAllUsers = await getAllUsers();
        let userList = tempAllUsers.filter((element) => element.id != currentUserId);
        setAllUsers(userList);

    }

    return(
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
            data={allUsers}
            renderItem={({ item }) => (
                <Card onPress={() => navigation.navigate('Chat', { 
                    userId: item.id, 
                    loggedInUserId: currentUserId, 
                    name: currentUser.name, 
                    avatar: currentUser.profileImageUrl, 
                    receipentName: item.name, 
                    receipentProfileImage: item.profileImageUrl 
                    })}>
                    <UserInfo>
                        <Image
                            source={{ uri: item.profileImageUrl }}
                            style={{ width: 50, height: 50, borderRadius: 100, alignSelf: "center" }}
                        />
                        <TextSection>
                            <UserInfoText>
                                <UserName>{item.name}</UserName>
                                <PostTime>{item.messageTime}</PostTime>
                            </UserInfoText>
                            <MessageText>{item.messageText}</MessageText>
                        </TextSection>
                    </UserInfo>
                </Card>
            )}
            keyExtractor={(item,index)=>index.toString()}
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