import {
    Container,
    Card,
    UserInfo,
    UserInfoText,
    UserName,
    TextSection,
} from './Styles/MessageStyles';
import { Animated } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    Dimensions, Image, FlatList, Menu
} from 'react-native';
import { getUserDetails, getAllUsers } from '../Helpers/User';
import { auth, fireDB } from '../Firebase';
import { useEffect, useState, useLayoutEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';


const AddPeopleInGroup = ({ navigation, route }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [searchBoolean, setBoolean] = useState(true);
    const [searchData, setSearchData] = useState([]);
    const currentUserId = auth.currentUser.uid;
    let newUserData = [];
    let usersInGroup = [];
    const [usersInGroupState, setUsersInGroupState] = useState([]);
    let userIdsInGroup = [];
    const [refresh, setRefresh] = useState(false);
    const groupName = route.params.groupName;
    const groupImageUrl = route.params.groupImageUrl;
    const groupId = route.params.groupId;
    const [tempUserIdState, setTempUserIdState] = useState([])

    useEffect(() => {
        readUser();
        getAllUsersFromDB();

    }, []);

    useLayoutEffect(() => {

        navigation.setOptions({
            title: "Add Contacts",
            headerStyle: { backgroundColor: '#009387' },
            headerRight: () => (
                    <TouchableOpacity onPress={generateGroup}>
                        <Text style={{ marginTop: 5, marginRight: 5,textAlign:'right', fontSize: 18, }}>CREATE </Text>
                    </TouchableOpacity>
            )
        })
    }, [navigation]);

    const generateGroup = async () => {
        let chatID = uuidv4();
        console.log("Created Chat Id", chatID);
        console.log("Group Name", groupName);
        console.log("Group Id", groupId);
        console.log("userse In Group", usersInGroupState);
        await createGroup(chatID);

    }

    const createGroup = async (chatId) => {
        const tempArray = tempUserIdState;
        tempArray.push(currentUserId);
        console.log("Temp Array ", tempArray);
        await fireDB.collection('groups').doc(groupId).set({
            name: groupName,
            profileImageUrl: groupImageUrl,
            chatID: chatId,
            usersList: tempArray,
            createdBy: currentUserId
        })
        storeChatIdtoUser(chatId);
    }

    const storeChatIdtoUser = async (chatID) => {
        tempUserIdState.forEach(async (userId) => {
            console.log("Adding");
            console.log(userId);
            await fireDB.collection('users').doc(userId).collection('chatIdList').doc(groupId).set({
                chatId: chatID,
                isGroup: true
            })
        })

        await fireDB.collection('users').doc(currentUserId).collection('chatIdList').doc(groupId).set({
            chatId: chatID,
            isGroup: true
        })
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


    const getAllUsersFromDB = async () => {
        fireDB.collection('users').doc(currentUserId).collection("chatIdList").onSnapshot((querySnapshot) => {
            const eachUserConnected = querySnapshot.docChanges().map(async ({ doc }) => {
                const eachUser = doc.data();
                eachUser.id = doc.id;
                if (eachUser.isGroup) {

                } else {
                    if (doc.id === currentUserId) {

                    } else {
                        eachUser.userData = await getUserDetails(doc.id);
                        eachUser.added = false;
                        newUserData.push(eachUser);
                        newUserData = newUserData.sort((a, b) => b.userData.name - a.userData.name);
                        setAllUsers(newUserData);
                    }
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

                <TextInput style={styles.searchText}
                    placeholder="Search Friend"
                    placeholderTextColor={"#009387"}
                    onChangeText={(input) => {
                        searchName(input)
                    }}
                />

            </View>

            <FlatList
                extraData={refresh}
                data={searchBoolean ? allUsers : searchData}
                renderItem={({ item }) => (
                    <Card
                        onPress={() => {

                            const tempArray = allUsers;
                            console.log("Pressed")


                            if (tempUserIdState.includes(item.id)) {
                                setTempUserIdState(current => current.filter(tempUserId => {
                                    return tempUserId != item.id;
                                }))
                            } else {
                                const tempUsersListInGroup = tempUserIdState;
                                tempUsersListInGroup.push(item.id);
                                setTempUserIdState(tempUsersListInGroup);
                            }

                            console.log(tempUserIdState);


                        }}
                    >
                        <UserInfo>

                            <Image
                                source={{ uri: item.userData.profileImageUrl }}
                                style={{ width: 50, height: 50, borderRadius: 100, alignSelf: "center" }}
                            />
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.userData.name}</UserName>
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