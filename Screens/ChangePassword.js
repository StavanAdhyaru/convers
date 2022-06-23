import { auth, fireDB } from "../firebase";
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
    Dimensions, Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const ChangePasswordScreen = ({ navigation }) => {
    const [data, setData] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: '',
        check_OldPassword:true,
        check_confirmPasswordInputChange: false,
        check_NewPasswordInputChange: false,
        secureTextEntry: true,
        securePasswordEntry: true,
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const signOut = () => {
        auth.signOut()
            .then(() => {
                navigation.replace("Login");
            })
            .catch(error => {
                console.log(error);
            }
            );
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

    const handleOldPassword = (val) => {
        setData({
            ...data,
            oldPassword: val,
        })
    }

    const handlePasswordChange = (val) => {
        const pattern2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const result2 = pattern2.test(val);

        if (result2) {
            setData({
                ...data,
                password: val,
                check_NewPasswordInputChange: true
            });
        } else {
            setData({
                ...data,
                password: val
            });
        }

    }
    const confirmPasswordInputChange = (val) => {
        if (val.length !== 0) {
            if (val === data.password) {
                setData({
                    ...data,
                    confirmPassword: val,
                    check_confirmPasswordInputChange: true
                });
            }
            else {
                setData({
                    ...data,
                    confirmPassword: val,
                });
            }

        }
    }

    const validate = () => {
        try {
            if ( check_OldPassword) {
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

    useEffect(() => {
        console.log("in useEffect");
    }, [])
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Change Password</Text>
            </View>
            <Animatable.View
                animation='fadeInUpBig'
                style={styles.footer}
            >
                {/* Current Password */}
                <Text style={styles.text_footer}>Current Password</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="lock"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        placeholder="Current Password"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={data.name}
                        onChangeText={(val) => handleOldPassword(val)}
                    />
                    {data.check_nameInputChange ?
                        <Animatable.View
                            animation="bounceIn">
                            <Feather
                                name="check-circle"
                                color="green"
                                size={20}/>
                        </Animatable.View>
                        : null}
                </View>
                {/* New Password */}
                <Text style={[styles.text_footer, {
                    marginTop: 15
                }]}>New Password</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="lock"
                        color="#05375a"
                        size={20}/>
                    <TextInput
                        placeholder="New Password"
                        style={styles.textInput}
                        autoCapitalize="none"
                        keyboardType='email-address'
                        value={data.email}/>
                    {data.check_emailInputChange ?
                        <Animatable.View
                            animation="bounceIn">
                            <Feather
                                name="check-circle"
                                color="green"
                                size={20}/>
                        </Animatable.View>
                        : null}
                </View>
                {/* Confirm Password */}
                <Text style={[styles.text_footer, {
                    marginTop: 15
                }]}>Confirm Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={data.contactNumber}
                        onChangeText={(val) => handleContactNumberChange(val)}/>
                    {data.check_contactNumberInputChange ?
                        <Animatable.View
                            animation="bounceIn">
                            <Feather
                                name="check-circle"
                                color="green"
                                size={20}/>
                        </Animatable.View>
                        : null}
                </View>
                {/* Change Password Button */}
                <View style={styles.button}>
                    <LinearGradient
                        colors={['#08d4c4', '#01ab9d']}
                        style={styles.deleteAccount}
                    >
                        <TouchableOpacity
                            onPress={signOut}>
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Change Password</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </Animatable.View>
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
        marginTop: 25
    },
    deleteAccount: {
        width: 340,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        color: "red"
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
export default ChangePasswordScreen;