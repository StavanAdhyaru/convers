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
        check_OldPassword:false,
        check_confirmPasswordInputChange: false,
        check_NewPasswordInputChange: false,
        secureOldTextEntry: true,
        secureNewPasswordEntry: true,
        secureConfirmPasswordEntry: true
    });

    const updateOldSecureTextEntry = () => {
        setData({
            ...data,
            secureOldTextEntry: !data.secureOldTextEntry
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureNewPasswordEntry: !data.secureNewPasswordEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            secureConfirmPasswordEntry: !data.secureConfirmPasswordEntry
        });
    }

    const handleOldPasswordChange = (val) => {
        const pattern2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const result2 = pattern2.test(val);

        if (result2) {
            setData({
                ...data,
                oldPassword: val,
                check_OldPassword: true
            });
        } else {
            setData({
                ...data,
                oldPassword: val
            });
        }
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
        const pattern2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const result2 = pattern2.test(val);

        if (result2) {
            setData({
                ...data,
                confirmPassword: val,
                check_confirmPasswordInputChange: true
            });
        } else {
            setData({
                ...data,
                confirmPassword: val
            });
        }
    }

    const changePass = () => {
        if(data.check_NewPasswordInputChange && data.check_confirmPasswordInputChange){
            if(data.password === data.confirmPassword){
                this.reauthenticate(data.oldPassword).then(() => {
                    var user = auth.currentUser;
                    user.updatePassword(data.password).then(() => {
                        console.log("Password Updated!");
                        Alert.alert('Success', 'Password changed', [{ text: 'OK' }]);
                    }).catch((error) => {console.log(error);})
                }).catch((error) => {console.log(error);})
            }else{
                Alert.alert('Filure', 'Password and confirm password does not match', [{ text: 'OK' }]);
            }
        }else{
            Alert.alert('Filure', 'Invalid Current Password', [{ text: 'OK' }]);
        }
    }

    reauthenticate = (currentPassword) => {
        var user  = auth.currentUser;
        var cred  = auth.EmailAuthProvider.credential(user.email,currentPassword);
        return user.reauthenticateWithCredential(cred);
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
                    <Feather
                        name="lock"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        style={styles.textInput}
                        secureTextEntry={data.secureOldTextEntry ? true : false}
                        autoCapitalize="none"
                    onChangeText={(val) => handleOldPasswordChange(val)}
                    />
                    <TouchableOpacity
                    onPress={updateOldSecureTextEntry}
                    >
                        {data.secureOldTextEntry ?
                  <Feather
                      name="eye-off"
                      color="grey"
                      size={20}
                  />
                  :
                  <Feather
                      name="eye"
                      color="grey"
                      size={20}
                  />}
                    </TouchableOpacity>
                </View>
                {/* New Password */}
                <Text style={[styles.text_footer, {
                    marginTop: 15
                }]}>New Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        style={styles.textInput}
                        secureTextEntry={data.secureNewPasswordEntry ? true : false}
                        autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                    />
                    <TouchableOpacity
                    onPress={updateSecureTextEntry}
                    >
                        {data.secureNewPasswordEntry ?
                  <Feather
                      name="eye-off"
                      color="grey"
                      size={20}
                  />
                  :
                  <Feather
                      name="eye"
                      color="grey"
                      size={20}
                  />}
                    </TouchableOpacity>
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
                        placeholder="Your Password"
                        style={styles.textInput}
                        secureTextEntry={data.secureConfirmPasswordEntry ? true : false}
                        autoCapitalize="none"
                    onChangeText={(val) => confirmPasswordInputChange(val)}
                    />
                    <TouchableOpacity
                    onPress={updateConfirmSecureTextEntry}
                    >
                        {data.secureConfirmPasswordEntry ?
                  <Feather
                      name="eye-off"
                      color="grey"
                      size={20}
                  />
                  :
                  <Feather
                      name="eye"
                      color="grey"
                      size={20}
                  />}
                    </TouchableOpacity>
                </View>
                {/* Change Password Button */}
                <View style={styles.button}>
                    <LinearGradient
                        colors={['#08d4c4', '#01ab9d']}
                        style={styles.deleteAccount}
                    >
                        <TouchableOpacity
                            onPress={changePass}>
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