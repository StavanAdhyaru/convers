import { auth, fireDB } from '../Firebase';
import { useEffect, useState, useLayoutEffect } from 'react';
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
    Image, Text
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

    useLayoutEffect(() => {

        navigation.setOptions({
            title: "ADD FRIEND",
            headerStyle: { backgroundColor: '#009387' },
        })
    }, [navigation]);

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

        
        


        <Container style={{marginTop:40}}>
            <Text style={{height:20,fontSize:20}}>Add a Friend</Text>
            <View style={styles.itemsearch}>

                <TextInput style={styles.searchText}
                    placeholder="Enter Email"
                    placeholderTextColor={"#009387"}
                    // textAlign= {'center'}
                    
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


            <Card style={{backgroundColor: '#D3D3D3'}}
                onPress = {() => navigation.navigate('Chat', {
                    userId: foundUser[0].id,
                    loggedInUserId: currentUserId,
                    name: currentUser.name,
                    avatar: currentUser.profileImageUrl,
                    receipentName: foundUser[0].name,
                    receipentProfileImage: foundUser[0].profileImageUrl
                })}
            >
                <UserInfo style={{padding: 15}}>
                    {
                        foundUser.length>0 ? <View style={{marginLeft: 15}}>
                        <Image
                            source={{ uri: foundUser[0].profileImageUrl }}
                            style={{ width: 80, height: 80, borderRadius: 90, alignSelf: "center" }}
                        />
                        <TextSection >
                            <UserInfoText >
                                <UserName style={{fontSize: 20}}>{foundUser[0].name}</UserName>
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
        padding: 20,
        margin: 50,
        borderRadius: 16,
        flexDirection: 'row',
    },
    groupIcon: {
        marginLeft: 30

    },
    searchIcon: {
        marginRight: 10
    },
    plus: {
        marginLeft: 20
    },
    searchText: {
        marginLeft:50,
        alignItems: 'center',
        width: 200,
    }
});

export default AddContact;