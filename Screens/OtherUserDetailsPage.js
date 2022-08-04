import { auth, fireDB, storage } from "../Firebase";
import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions, Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { deleteChat } from '../Helpers/Chat';

const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;


const OtherUserDetailsPage = ({ navigattion, route }) => {
    const { otherUserId } = route.params;
    const chatId = route.params.chatId;
    const [otherUserData, setOtherUserData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        profileImageUrl: ''
    })

    useEffect(() => {
        getUserDataFromDB();
    }, []);

    const getUserDataFromDB = async () => {
        try {
            console.log("in getUserDataFromDB");
            let userId = auth.currentUser.uid;
            console.log(userId);
            let response = await fireDB.collection('users').doc(otherUserId).get();
            console.log('userData: ', response.data());
            let userData = response.data();
            setOtherUserData({
                ...userData
            })

        } catch (error) {
            console.log('error: ', error);

        }
    }
    const deleteConversation = async () => {
        console.log("Deletion of Chat Id: ", chatId)
        try {
            deleteChat(chatId);
        }
        catch (error) {
            console.log(error)
        }

    }
    return (

        <View style={styles.container}>
                <StatusBar backgroundColor='#009387' barStyle="light-content" />
                <View>
                <Text style={{marginLeft: 180, fontSize: 25, marginTop: 25}}>Hey</Text>
                    <Image
                        source={{ uri: otherUserData.profileImageUrl }}
                        alt = {require(`../assets/default-user-image.png`)}
                        style={{ width: 240, height: 240, borderRadius: 250, alignSelf: "center", marginTop: 50 }}
                    />
                </View>
                <ScrollView>
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
                            value={otherUserData.name}
                            editable={false}
                        />
                    </View>
                    {/* Email */}
                    <Text style={[styles.text_footer, {
                        marginTop: 15
                    }]}>Email</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="envelope-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Email"
                            style={styles.textInput}
                            autoCapitalize="none"
                            keyboardType='email-address'
                            value={otherUserData.email}
                            editable={false}
                        />
                    </View>
                    {/* Contact Number */}
                    <Text style={[styles.text_footer, {
                        marginTop: 15
                    }]}>Contact Number</Text>
                    <View style={styles.action}>
                        <Feather
                            name="phone"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Contact Number"
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={otherUserData.contactNumber}
                            editable={false}
                        />
                    </View>
                    {/* Edit/Save account Button */}

                    {/* Change Password Button */}

                    {/* Delete account Button */}
                    <View style={styles.button}>
                        <LinearGradient
                            colors={['#FF0000', '#FF0000']}
                            style={styles.deleteAccount}
                        >
                            <TouchableOpacity
                                onPress={deleteConversation}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Delete Conversation</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                    {/* Sign out account Button */}



                </Animatable.View>
            </ScrollView>
        </View>
    )


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
        paddingVertical: 30,
        marginTop: 50
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

export default OtherUserDetailsPage;