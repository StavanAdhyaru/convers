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
import { auth, fireDB } from '../firebase';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChat } from '../API/chat';



const ContactListPage = ({navigation, item}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [searchBoolean,setBoolean] = useState(true);
    const [searchData,setSearchData] = useState([]);
    const currentUserId = auth.currentUser.uid;
    let userData = [];

    const searchName = (input)=> {
        let data = allUsers;
        if(input === ""){
            setBoolean(true);
            setSearchData(data);
        }else{
            setBoolean(false);
            let searchD = data.filter((item) =>{
                return item.userData.name.toLowerCase().includes(input.toLowerCase())
            });
            setSearchData(searchD);
        }
        
        
    }
    useEffect(() => {
        readUser();
        
        getAllUsersFromDB();
        
    },[]);
    
    const readUser = async () => {
            const getUser = await getUserDetails(currentUserId)
            // await AsyncStorage.setItem('user', JSON.stringify(getUser));
            setCurrentUser(getUser);
            console.log("user: ",currentUser )
    }
    const getAllUsersFromDB = async () => {
        
        fireDB.collection('users').doc(auth.currentUser.uid).collection("chatIdList").onSnapshot((querySnapshot) => {
            const eachUserConnected = querySnapshot.docChanges().map(async ({ doc }) => {
                const eachUser = doc.data();
                eachUser.id = doc.id;
                eachUser.userData = await getUserDetails(doc.id);
                eachUser.chatData = await getChat(eachUser.chatId);
                eachUser.messageCount = eachUser.chatData.length;
                console.log("each User",eachUser);
                userData.push(eachUser);
                userData = userData.sort((a, b) => b.chatData[0].createdAt.getTime() - a.chatData[0].createdAt.getTime());
                setAllUsers(userData);
            });
            
            
            // console.log("User Data: ",userData);
            // setAllUsers(userData);
            
            // console.log("All Users ",allUsers);
            // console.log("one data",allUsers[0].chatData[allUsers[0].chatData.length-1].createdAt);
        })
        
        
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
            extraData={allUsers}
            data={searchBoolean ? allUsers : searchData} 
            renderItem={({ item }) => (
                <Card onPress={() => navigation.navigate('Chat', { 
                    userId: item.id, 
                    loggedInUserId: currentUserId, 
                    name: currentUser.name, 
                    avatar: currentUser.profileImageUrl, 
                    receipentName: item.userData.name, 
                    receipentProfileImage: item.userData.profileImageUrl 
                    })}>
                    <UserInfo>
                        
                        <Image
                            source={{ uri: item.userData.profileImageUrl }}
                            style={{ width: 50, height: 50, borderRadius: 100, alignSelf: "center" }}
                        />
                        <TextSection>
                            <UserInfoText>
                                {
                                    console.log("message Count",item.messageCount)
                                }
                                {
                                    console.log("Name: ",item.userData.name)
                                }
                                {
                                    console.log("Text: ",item.chatData[0].createdAt.toLocaleDateString())
                                }
                                <UserName>{item.userData.name}</UserName>
                                {/* <PostTime>{`${item.chatData[0].createdAt.getDate()}`+"/"+`${item.chatData[0].createdAt.getMonth()}`+"/"+`${item.chatData[0].createdAt.getYear()}`}</PostTime> */}
                                <PostTime>{`${item.chatData[0].createdAt.toLocaleDateString()}`}</PostTime>
                            </UserInfoText>
                            <MessageText>{item.chatData[0].text}</MessageText>
                        </TextSection>
                    </UserInfo>
                </Card>
            )}
            keyExtractor={(item)=>item.id}
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