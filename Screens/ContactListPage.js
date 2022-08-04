import {
    Container,
    Card,
    UserInfo,
    UserInfoText,
    UserName,
    PostTime,
    MessageText,
    TextSection,
} from './Styles/MessageStyles';
import {
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    FlatList
} from 'react-native';
import { getUserDetails, getGroupDetails } from '../Helpers/User';
import { getChat } from '../Helpers/Chat';
import { auth, fireDB } from '../Firebase';
import { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from "@react-navigation/native";


const ContactListPage = ({ navigation, route }) => {
    const isFocused = useIsFocused();
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [searchBoolean, setBoolean] = useState(true);
    const [searchData, setSearchData] = useState([]);
    const currentUserId = auth.currentUser.uid;
    let userData = [];

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

    useEffect(() => {
        readUser();
        getAllUsersFromDB();

    }, [isFocused]);


    const readUser = async () => {
        const getUser = await getUserDetails(currentUserId)
        setCurrentUser(getUser);
    }

    const getAllUsersFromDB = async () => {

        fireDB.collection('users').doc(auth.currentUser.uid).collection("chatIdList").onSnapshot((querySnapshot) => {
            const eachUserConnected = querySnapshot.docChanges().map(async ({ doc }) => {
                const eachUser = doc.data();
                eachUser.id = doc.id;

                if (eachUser.isGroup) {
                    eachUser.userData = await getGroupDetails(doc.id);
                } else {
                    eachUser.userData = await getUserDetails(doc.id);
                }

                eachUser.chatData = await getChat(eachUser.chatId);
                userData.push(eachUser);
                userData = userData.sort((a, b) => {
                    if (a.chatData[0] != null && b.chatData[0] != null) {
                        b.chatData[0].createdAt.getTime() - a.chatData[0].createdAt.getTime()
                    }
                });
                setAllUsers(userData);
            });
        })

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
                    placeholder="Enter Name"
                    placeholderTextColor={"#009387"}
                    onChangeText={(input) => {
                        searchName(input)
                    }}
                />
                <TouchableOpacity onPress={() => navigation.navigate('CreateGroupName')}>
                    <Feather style={styles.groupIcon}
                        name="users"
                        color="#009387"
                        size={20}
                        alignItems=""
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('AddContact')}>
                    <Feather style={styles.plus}
                        name="plus-circle"
                        color="#009387"
                        size={20}
                        alignItems=""
                    />
                </TouchableOpacity>

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
                        receipentName: item.userData ? item.userData.name : "",
                        receipentProfileImage: item.userData ? item.userData.profileImageUrl : "",
                        chatId: item.chatId,
                        isGroup: item.isGroup
                    })}>
                        <UserInfo>

                            <Image
                                source={{ uri: item.userData ? item.userData.profileImageUrl : "" }}
                                style={{ width: 50, height: 50, borderRadius: 100, alignSelf: "center" }}
                            />
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.userData ? item.userData.name : ""}</UserName>
                                    {
                                        item.chatData[0] != null ? <PostTime>{`${item.chatData[0].createdAt.toLocaleDateString()}`}</PostTime> : <PostTime></PostTime>
                                    }

                                </UserInfoText>
                                {
                                    item.chatData[0] != null ? <MessageText>{item.chatData[0].text}</MessageText> : <MessageText></MessageText>
                                }

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

export default ContactListPage;