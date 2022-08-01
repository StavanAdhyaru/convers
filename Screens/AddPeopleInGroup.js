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
import { Animated } from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    Pressable,
    StatusBar,
    Alert,
    Button,
    Dimensions, Image, FlatList, Menu
} from 'react-native';
import { getUserDetails, getAllUsers } from '../API/user';
import { auth, fireDB } from '../firebase';
import { useEffect, useState,useLayoutEffect } from 'react';
import { getChat,storeChatForGroup } from '../API/chat';
// import Icon from 'react-native-ico-material-design';
import Feather from 'react-native-vector-icons/Feather';
import { useRadioGroup } from '@material-ui/core';


const AddPeopleInGroup = ({ navigation, route }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [searchBoolean, setBoolean] = useState(true);
    const [searchData, setSearchData] = useState([]);
    const currentUserId = auth.currentUser.uid;
    let newUserData = [];
    let usersInGroup = [];
    const [usersInGroupState,setUsersInGroupState] = useState([]);
    let userIdsInGroup = [];
    const [refresh,setRefresh] = useState(false);
    const groupName = route.params.groupName;
    const groupImageUrl = route.params.groupImageUrl;
    const groupId = route.params.groupId;

    useEffect(() => {
        readUser();
        // getAlredyUser();
        getAllUsersFromDB();

    }, []);
    useLayoutEffect(() => {

        navigation.setOptions({
            title: "Add Contacts",
            headerStyle: { backgroundColor: '#009387' },
            headerRight: () => (
                // <View style={{
                //     flexDirection: 'row',

                //     justifyContent: 'space-between',
                //     marginLeft: 200,

                // }}>
                    <TouchableOpacity onPress={generateGroup}>
                        <Text style={{ marginTop: 35, width: 100, marginRight: 140,textAlign:'right' }}>Create Group</Text>
                    </TouchableOpacity>

                // </View>
            )
        })
    }, [navigation]);

    const generateGroup = async () => {
        let chatID = uuidv4();
        console.log("Created Chat Id",chatID);
        console.log("Group Name", groupName);
        console.log("Group Id", groupId);
        console.log("userse In Group", usersInGroupState);
        await storeChatForGroup(chatID);

        const temp = usersInGroupState;
        temp.push(currentUserId);
        setUsersInGroupState(temp);

        for(let i=0;i<usersInGroup.length;i++){
            userIdsInGroup.push(usersInGroupState[i].id);
        }
        console.log(userIdsInGroup)
        await createGroup(chatID);

    }

    const createGroup = async (chatId) => {
       await fireDB.collection('groups').doc(groupId).set({
            groupName: groupName,
            groupImageUrl: groupImageUrl,
            chatID: chatId,
            usersList: userIdsInGroup
        })
        storeChatIdtoUser(chatId);
    }

    const storeChatIdtoUser = async (chatID) =>  {
        for(let i=0; i<userIdsInGroup.length ;i++){
            await fireDB.collection('users').doc(userIdsInGroup[i]).collection('chatIdList').doc(groupId).set({
                chatID: chatID,
                isAGroup: true
            })
        }
        navigation.navigate('Home');
    }

    const searchName = (input) => {
        let data = allUsers;
        if (input === "") {
            setBoolean(true);
            setSearchData(data);
        } else {
            setBoolean(false);
            let searchD = data.filter((item) => {
                return item.userData.name.toLowerCase().includes(input.toLowerCase())
            });
            setSearchData(searchD);
        }
    }

    // const getAlredyUser = async () => {

    //     fireDB.collection('users').doc(auth.currentUser.uid).collection("chatIdList").onSnapshot((querySnapshot) => {
    //         const eachUserConnected = querySnapshot.docChanges().map(async ({ doc }) => {
    //             const eachUser = doc.data();
    //             eachUser.id = doc.id;
    //             userData.push(eachUser.id);

    //         });

    //     })
    // }
    const getAllUsersFromDB = async () => {
        fireDB.collection('users').onSnapshot((querySnapshot) => {
            const eachUserConnected = querySnapshot.docChanges().map(async ({ doc }) => {
                const eachUser = doc.data();
                eachUser.id = doc.id;
                if (doc.id === currentUserId) {

                } else {
                    eachUser.userData = await getUserDetails(doc.id);
                    eachUser.added = false;
                    newUserData.push(eachUser);
                    newUserData = newUserData.sort((a, b) => b.userData.name - a.userData.name);
                    setAllUsers(newUserData);
                }
            })
        })
    }
    const readUser = async () => {
        const getUser = await getUserDetails(currentUserId)
        setCurrentUser(getUser);
        usersInGroup.push(currentUser);
    }
    const addContactToGroup = (uData) => {
        // console.log(uData);
    }


    return (
        <Container>
            <View style={styles.itemsearch}>

                <Feather style={styles.searchIcon}
                    name="search"
                    color="#009387"
                    size={20}
                />



                {/* SearchIcon = <SearchIcon/> */}
                <TextInput style={styles.searchText}
                    placeholder="Search Friend"
                    placeholderTextColor={"#009387"}
                    onChangeText={(input) => {
                        searchName(input)
                    }}
                // style={{ fontSize: 18 }}
                />

            </View>

            <FlatList
                extraData={refresh}
                data={searchBoolean ? allUsers : searchData}
                renderItem={({ item }) => (
                    <Card
                        onPress={() => {

                            const tempArray = allUsers;
                            let flag = true;
                            console.log("Pressed")
                            console.log("Helloo",usersInGroup)
                            if(usersInGroup.length>0){
                                for(let i=0;i<usersInGroup.length;i++){
                                    if(item.id === usersInGroup[i].id){
                                        usersInGroup.splice(i,1);
                                        console.log("Hello")
                                        // for(let i=0;i<tempArray.length;i++){
                                        //     if(item.id === tempArray.id){
                                        //         tempArray[i].added = false;
                                        //         setAllUsers(tempArray);
                                        //         break;
                                        //     }
                                        // }
                                        setUsersInGroupState(usersInGroup);
                                        flag=false;
                                    }
                                }
                            }
                           
                            if(flag){
                                console.log("I was here")
                                usersInGroup.push(item);
                                setUsersInGroupState(usersInGroup);
                                console.log(usersInGroup)
                            }
                            
                            // if(item.added){
                            //     for(let i=0;i<usersInGroup.length;i++){
                            //         if(item.id === usersInGroup[i].id){
                            //             usersInGroup.splice(i,1);
                            //             for(let i=0;i<tempArray.length;i++){
                            //                 if(item.id === tempArray.id){
                            //                     tempArray[i].added = false;
                            //                     setAllUsers(tempArray);
                            //                     break;
                            //                 }
                            //             }
                            //         }
                            //     }
                                
                            //     console.log(usersInGroup);
                            // }else{
                            //     for(let i=0;i<usersInGroup.length;i++){
                            //         if(item.id === usersInGroup[i].id){
                                        
                            //         }
                            //     }
                            //     usersInGroup.push(item);
                            //     for(let i=0;i<tempArray.length;i++){
                            //         if(item.id === tempArray.id){
                            //             tempArray[i].added = true;
                            //             console.log("Temp Array",tempArray[i]);
                            //             setAllUsers(tempArray);
                            //             break;
                            //         }
                            //     }
                            //     console.log(usersInGroup);
                                
                            // }
                        }}
                    // onPress={() => navigation.navigate('Chat', {
                    //     userId: item.id,
                    //     loggedInUserId: currentUserId,
                    //     name: currentUser.name,
                    //     avatar: currentUser.profileImageUrl,
                    //     receipentName: item.userData.name,
                    //     receipentProfileImage: item.userData.profileImageUrl
                    // })}
                    >
                        <UserInfo>

                            <Image
                                source={{ uri: item.userData.profileImageUrl }}
                                style={{ width: 50, height: 50, borderRadius: 100, alignSelf: "center" }}
                            />
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.userData.name}</UserName>
                                    {/* <PostTime>{`${item.chatData[0].createdAt.toLocaleDateString()}`}</PostTime> */}
                                    <TouchableOpacity>

                                        {
                                            item.added ? <Feather style={styles.plus}
                                                name="check-circle"
                                                color="#009387"
                                                size={20}
                                                alignItems=""
                                            /> : <Feather style={styles.plus}
                                                name="plus-circle"
                                                color="#009387"
                                                size={20}
                                                alignItems=""
                                            />
                                        }
                                    </TouchableOpacity>
                                </UserInfoText>
                                {/* <MessageText>{item.chatData[0].text}</MessageText> */}
                            </TextSection>
                        </UserInfo>
                    </Card>
                )}
                keyExtractor={(item) => item.id}
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
    },
    itemsearch: {
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
    },
    groupIcon: {
        marginLeft: 80

    },
    searchIcon: {
        marginRight: 10
    },
    plus: {
        marginLeft: 20
    },
    searchText: {
        marginLeft: 10
    }
});

export default AddPeopleInGroup;