import { auth, fireDB } from '../Firebase';
import { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {
    Container,
    Card,
    UserInfo,
    UserInfoText,
    UserName,
    TextSection,
} from './Styles/MessageStyles';
import {
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image
} from 'react-native';
import { getUserDetails, findUserByEmail } from '../Helpers/User';


const AddContact = ({ navigation, route }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const currentUserId = auth.currentUser.uid;
    const [searchEmailId, setSearchEmailId] = useState("");
    const [foundUser, setFoundUser] = useState([]);
    const foundUsers = []

    useEffect(() => {
        readUser();
    }, []);

    const readUser = async () => {
        const getUser = await getUserDetails(currentUserId);
        setCurrentUser(getUser);
    }

    const searchUser = async () => {

        await fireDB.collection('users').where('email', '==', searchEmailId.toLowerCase()).get().then((snapshot) => {
            if (snapshot.empty) {
                console.log('No matching documents.');
            }
            snapshot.forEach(doc => {

                if (doc.id == currentUserId) {
                    return;
                }
                foundUsers.push(doc.data());
                foundUsers[foundUsers.length - 1].id = doc.id
                setFoundUser(foundUsers);
                foundUsers.empty;
                console.log("Found User", foundUsers[foundUsers.length - 1]);
            });
        });

    }

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

            <Card
                onPress={() => navigation.navigate('Chat', {
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
                        foundUser.length > 0 ? <View>
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 70,
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
        margin: 10
    }
});

export default AddContact;