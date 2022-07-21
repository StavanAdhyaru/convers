import { auth, fireDB, storage } from "../firebase";
import { useState, useEffect } from 'react';
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
    ScrollView,
    Dimensions, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;
const SettingsPage = ({ navigation }) => {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: '',
        address: '',
        profileImageUrl: '',
        check_nameInputChange: false,
        check_emailInputChange: false,
        check_passwordInputChange: false,
        check_confirmPasswordInputChange: false,
        check_contactNumberInputChange: false,
        check_addressInputChange: false,
        secureTextEntry: true,
        securePasswordEntry: true,
    });
    const [photo, setPhoto] = useState('');
    const [url, setUrl] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    const currentUser = auth.currentUser;
    const signOut = () => {
        auth.signOut()
            .then(() => {
                navigation.replace("Log");
            })
            .catch(error => {
                console.log(error);
            }
            );
    }

    const changePasswortd = () => {
        navigation.navigate('CP');
    }

    const getUserDataFromDB = async () => {
        try {
            console.log("in getUserDataFromDB");
            let userId = auth.currentUser.uid;
            console.log(userId);
            let response = await fireDB.collection('users').doc(userId).get();
            console.log('userData: ', response.data());
            let userData = response.data();
            setData({
                ...userData
            })
            setUrl(userData.profileImageUrl);
            
        } catch (error) {
            console.log('error: ', error);
            
        }
    }
    const saveUserDataAfterEdit = async () => {
        try {
            let userId = auth.currentUser.uid;
            
            let userSaved = await fireDB.collection("users").doc(userId).update({
                // ...userData,
                name: data.name,
                contactNumber: data.contactNumber,
            });
            console.log("User saved:: ", userSaved);
        } catch (error) {
            console.log('error: ', error);
            
        }
    }
    const editSaveMode = () => {
        if(isEditMode) {
            // save
            saveUserDataAfterEdit();
            setIsEditMode(false);
        } else {
            // edit
            setIsEditMode(true);
        }
    }
    const handleNameChange = (val) => {
        if(isEditMode) {
            setData({
                ...data,
                name: val,
                check_nameInputChange: true,
            })
            console.log('data: ', data);
        }
    }
    const handleContactNumberChange = (val) => {
        if(isEditMode) {
            setData({
                ...data,
                contactNumber: val,
                check_contactNumberInputChange: true,
            })
        }
    }
    const handleAddressChange = (val) => {
        if(isEditMode) {
            setData({
                ...data,
                address: val,
                check_addressInputChange: true
            })
        }
    }
    const validate = () => {
        try {
            if (data.check_nameInputChange && data.check_contactNumberInputChange && data.check_addressInputChange) {
                return true;
            }
            else {
                Alert.alert('Error', 'Please enter all the details', [{ text: 'OK' }]);
                return false;
            }
            
        } catch (error) {
            console.log('error: ', error);
            
        }
    }
    const deleteAccountFromDB = async () => {
        try {
            let userId = auth.currentUser.uid;
            await fireDB.collection("Users").doc(userId).delete();
            await auth.currentUser.delete();
            Alert.alert("Success","Account deleted successfully",[{ text: 'OK' }])
            navigateToSignInScreen();
            
        } catch (error) {
            console.log('error: ', error);
            
        }
    }
    const navigateToSignInScreen = () => {
        navigation.replace("Login");
    }

    const uploadPhoto = (image) => {
        return new Promise( async (resolve, reject) => {
            try {
                // upload
                console.log('image argument:: ', image.uri);
                const response = await fetch(image.uri)
                const blob = await response.blob();
                var ref = storage.ref("images/").child(`${currentUser.uid}`);
                console.log("_____________________LOADING...____________________");
                resolve(ref.put(blob));
                
            } catch (error) {
                console.log('error: ', error);
                reject(error);
            }
        })
    }

    const getDownloadURL = async () => {
        try {
            console.log('old url: ', url);
            // get download url
            let tempUrl = await storage.ref("images").child(`${currentUser.uid}`).getDownloadURL();
            setUrl(tempUrl);
            console.log('new url: ', tempUrl);

            await updateUserDoc(tempUrl);
            
        } catch (error) {
            console.log('error: ', error);
            
        }
    }

    const updateUserDoc = async (tempUrl) => {
        try {
            // update user document

            console.log('updating url: ', tempUrl);
            let dbResponse = await fireDB.collection("users").doc(`${currentUser.uid}`).update({profileImageUrl: tempUrl});
            console.log('dbResponse: ', dbResponse);
            setData({
                ...data,
                profileImageUrl: url
            });
            
        } catch (error) {
            console.log('error: ', error);
            
        }
    }

    const changeProfileImage = async () => {
        try {
            setUrl(data.profileImageUrl);
            console.log('old old fetched from db ::: url: ', data.profileImageUrl);
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

    


    useEffect( () => {
        console.log("in useEffect");
        getUserDataFromDB();
    }, [])
    return (
            <View style={styles.container}>
                <StatusBar backgroundColor='#009387' barStyle="light-content" />
                <View style={styles.header}>
                    <Text style={styles.text_header}>My account</Text>
                </View>
                <View>
                    <Image
                        source={{ uri: url   }}
                        alt = {require(`../assets/default-user-image.png`)}
                        style={{ width: 170, height: 170, borderRadius: 100, alignSelf: "center" }}
                    />
                    <View style={styles.button}>
                    <TouchableOpacity 
                        onPress={changeProfileImage}
                    >
                        <Text style={[styles.textSign, {
                            color: '#ECCC01', padding: 10
                        }]}>Change profile image</Text>
                    </TouchableOpacity>
                    </View>
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
                            value={data.name}
                            onChangeText={(val) => handleNameChange(val)}
                        />
                        {data.check_nameInputChange ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
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
                            value={data.email}
                        />
                        {data.check_emailInputChange ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
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
                            value={data.contactNumber}
                            onChangeText={(val) => handleContactNumberChange(val)}
                        />
                        {data.check_contactNumberInputChange ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
                    </View>
                    {/* Edit/Save account Button */}
                    <View style={styles.button}>
                        <LinearGradient
                            colors={['#08d4c4', '#01ab9d']}
                            style={styles.deleteAccount}
                        >
                            <TouchableOpacity 
                                onPress={editSaveMode}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>{isEditMode ? "Save" : "Edit"}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                    {/* Change Password Button */}
                    <View style={styles.button}>
                        <LinearGradient
                            colors={['#08d4c4', '#01ab9d']}
                            style={styles.deleteAccount}
                        >
                            <TouchableOpacity 
                                onPress={changePasswortd}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Change Password</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                    {/* Delete account Button */}
                    <View style={styles.button}>
                        <LinearGradient
                            colors={['#FF0000', '#FF0000']}
                            style={styles.deleteAccount}
                        >
                            <TouchableOpacity 
                                onPress={deleteAccountFromDB}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Delete Account</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                    {/* Sign out account Button */}
                    <View style={styles.button}>
                        <LinearGradient
                            colors={['#08d4c4', '#01ab9d']}
                            style={styles.deleteAccount}
                        >
                            <TouchableOpacity 
                                onPress={signOut}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Sign out</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    
                </Animatable.View>
                </ScrollView>
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
export default SettingsPage;