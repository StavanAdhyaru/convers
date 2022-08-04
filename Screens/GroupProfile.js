import { auth, fireDB, storage } from "../Firebase";
import { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Dimensions, Image, FlatList
} from 'react-native';
import {
    Card,
    UserInfo,
    UserInfoText,
    UserName,
    TextSection,
} from './Styles/MessageStyles';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const GroupProfile = ({ navigattion, route }) => {

    const { groupId } = route.params;
    const [groupData, setGroupData] = useState({
        name: '',
        profileImageUrl: '',
        usersList: [],
        chatId: '',
        createdBy: ''
    });
    const [userData, setUserData] = useState([]);
    const tempUserData = [];
    const isFocused = useIsFocused();
    const currentUserId = auth.currentUser.uid;
    const [photo, setPhoto] = useState('');

    useEffect(() => {
        console.log("Group Id", groupId);
        console.log("Group Data in Group Profile", groupData);
        let tempUsers = [];
        fireDB.collection('groups').doc(groupId).onSnapshot((snapshot) => {
            let gData = snapshot.data();
            setGroupData({
                ...gData
            })

            if(gData != null){
                gData.usersList.forEach((userId) => {
                    fireDB.collection('users').doc(userId).onSnapshot((snapshot1) => {
                        console.log("Snapshot value ", snapshot1.data());
                        tempUsers.push(snapshot1.data());
                        setUserData(tempUsers);
                    })
                })
            }
            

        })

    }, [isFocused]);

    const deleteGroup = () => {
        fireDB.collection('chats').doc(groupData.chatId).delete();
        groupData.usersList.forEach((uId) => {
            fireDB.collection('users').doc(uId).collection('chatIdList').doc(groupId).delete();
        })
        fireDB.collection('groups').doc(groupId).delete().then(() => {
            navigation.replace("Home");
        });
        
    }
    const changeProfileImage = async () => {
        try {
            setUrl(data.profileImageUrl);
            console.log('old old fetched from db ::: url: ', groupData.profileImageUrl);
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                base64: true,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });

            if (!result.cancelled) {
                console.log('result: ', result.uri);
                setPhoto(result);

                uploadPhoto(result).then(async () => {
                    await getDownloadURL();
                    alert("Image uploaded!")
                }).catch((error) => {
                    alert("Could not upload Image.");
                })
            }
        } catch (error) {
            console.log('error: ', error);

        }
    }

    const getDownloadURL = async () => {
        try {
            console.log('old url: ', url);
            // get download url
            let tempUrl = await storage.ref("images").child(`${groupId}`).getDownloadURL();
            setUrl(tempUrl);
            console.log('new url: ', tempUrl);

            await updateUserDoc(tempUrl);

        } catch (error) {
            console.log('error: ', error);

        }
    }

    const uploadPhoto = (image) => {
        return new Promise(async (resolve, reject) => {
            try {
                // upload
                console.log('image argument:: ', image.uri);
                const response = await fetch(image.uri)
                const blob = await response.blob();
                var ref = storage.ref("images/").child(`${groupId}`);
                console.log("_____________________LOADING...____________________");
                resolve(ref.put(blob));

            } catch (error) {
                console.log('error: ', error);
                reject(error);
            }
        })
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <View>
                <Image
                    source={{ uri: groupData.profileImageUrl }}
                    alt={require(`../assets/default-user-image.png`)}
                    style={{ width: 170, height: 170, borderRadius: 100, alignSelf: "center" }}
                />
                <View style={styles.button}>
                    <TouchableOpacity
                        onPress={changeProfileImage}
                    >
                       {
                        groupData.createdBy === currentUserId ? <Text style={[styles.textSign, {
                            color: '#ECCC01', padding: 10
                        }]}>Change profile image</Text> : <View></View>
                       } 
                    </TouchableOpacity>
                </View>
            </View>
            {/* <ScrollView> */}
            <Animatable.View
                animation='fadeInUpBig'
                style={styles.footer}
            >
                {/* Name */}
                <Text style={styles.text_footer}>Name</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Name"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={groupData.name}
                        editable={false}
                    />
                </View>
                {/* Email */}
                <Text style={[styles.text_footer, {
                    marginTop: 15
                }]}>Participants</Text>
                <FlatList
                    extraData={userData}
                    data={userData}
                    renderItem={({ item }) => (
                        <Card>
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
                />


                {
                    groupData.createdBy === currentUserId ? <View style={styles.button}>
                        <LinearGradient
                            colors={['#FF0000', '#FF0000']}
                            style={styles.deleteAccount}
                        > 
                        <TouchableOpacity onPress={deleteGroup}>
                         
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Delete Group</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View> : <View></View>
                }


                {/* Sign out account Button */}



            </Animatable.View>
            {/* </ScrollView> */}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    footer: {
        flex: 6,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    logo: {
        width: height_logo,
        height: height_logo
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -3,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        margin: 10
    },
    deleteAccount: {
        width: 340,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        color: "red"
    },
    changeProfileImage: {
        width: 250,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        color: "blue"
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default GroupProfile;
