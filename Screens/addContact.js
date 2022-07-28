import { auth, fireDB } from '../firebase';
import { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
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
    Pressable,
    StatusBar,
    Alert,
    Button,
    Dimensions, Image, FlatList, Menu
} from 'react-native';
import { getUserDetails, findUserByEmail } from '../API/user';


const AddContact = ({ navigation, route }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const currentUserId = auth.currentUser.uid;
    const [searchEmailId, setSearchEmailId] = useState("");
    const [foundUser, setFoundUser] = useState([]);
    const [foundUserId, setFoundUserId] = useState("");
    const [a, setA] = useState([]);
    const foundUsers = []



    useEffect(() => {
        readUser();
    }, []);

    const readUser = async () => {
        const getUser = await getUserDetails(currentUserId);
        setCurrentUser(getUser);
    }

    const searchUser = async () => {

        await fireDB.collection('users').where('email', '==', searchEmailId).get().then((snapshot) => {
            if (snapshot.empty) {
                console.log('No matching documents.');
            }
            snapshot.forEach(doc => {

                if (doc.id == currentUserId) {
                    return;
                }
                // console.log(doc.id, '=>', doc.data());
                foundUsers.push(doc.data());
                foundUsers[foundUsers.length - 1].id = doc.id
                setFoundUser(foundUsers);
                // setA(foundUsers);
                // setFoundUser(foundUsers[foundUsers.length-1]);
                // setFoundUserId(doc.id);
                foundUsers.empty;
                console.log("Found User", foundUsers[foundUsers.length - 1]);
            });
        });

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
    // const getAllUsersFromDB = async () => {
    //     fireDB.collection('users').onSnapshot((querySnapshot) => {
    //         const eachUserConnected = querySnapshot.docChanges().map(async ({ doc }) => {
    //             const eachUser = doc.data();
    //             eachUser.id = doc.id;
    //             if (userData.includes(doc.id)) {

    //             } else if (doc.id === currentUserId) {

    //             } else {
    //                 eachUser.userData = await getUserDetails(doc.id);
    //                 newUserData.push(eachUser);
    //                 setAllUsers(newUserData);
    //             }
    //         })
    //     })
    // }

    return (
        <Container>
            <View style={styles.itemsearch}>
                <TextInput style={styles.searchText}
                    placeholder="Search Friend"
                    placeholderTextColor={"#009387"}
                    onChangeText={(input) => {
                        setSearchEmailId(input)
                    }}
                />
                <TouchableOpacity onPress={searchUser}>
                    <Feather style={styles.groupIcon}
                        name="search"
                        color="#009387"
                        size={20}
                    />
                </TouchableOpacity>

            </View>
            {/* <FlatList
                extraData={a}
                data={a}
                renderItem={({ item }) => (
                    <Card onPress={() => navigation.navigate('Chat', {
                        // userId: item.id,
                        // loggedInUserId: currentUserId,
                        // name: currentUser.name,
                        // avatar: currentUser.profileImageUrl,
                        // receipentName: item.userData.name,
                        // receipentProfileImage: item.userData.profileImageUrl
                    })}>
                        <UserInfo>

                            <Image
                                source={{ uri: item.profileImageUrl }}
                                style={{ width: 50, height: 50, borderRadius: 100, alignSelf: "center" }}
                            />
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.name}</UserName>
                                </UserInfoText>
                            </TextSection>
                        </UserInfo>
                    </Card>
                )}
                keyExtractor={(item) => item.id}
            /> */}


            <Card 
                onPress = {() => navigation.navigate('Chat', {
                    userId: foundUser[0].id,
                    loggedInUserId: currentUserId,
                    name: currentUser.name,
                    avatar: currentUser.profileImageUrl,
                    receipentName: foundUser[0].name,
                    receipentProfileImage: foundUser[0].profileImageUrl
                })}
            >
                <UserInfo>
                    {
                        foundUser.length>0 ? <View>
                        <Image
                            source={{ uri: foundUser[0].profileImageUrl }}
                            style={{ width: 50, height: 50, borderRadius: 100, alignSelf: "center" }}
                        />
                        <TextSection>
                            <UserInfoText>
                                <UserName>{foundUser[0].name}</UserName>
                            </UserInfoText>
                        </TextSection>
                        </View> : <View></View>
                    }
                    
                </UserInfo>
            </Card>
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

export default AddContact;