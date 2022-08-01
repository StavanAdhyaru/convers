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
import { auth, fireDB } from '../firebase';
const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const Registration = ({navigation,route}) => {

    const dbRef = fireDB.collection('users');
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: '',
        check_nameInputChange: false,
        check_emailInputChange: false,
        check_passwordInputChange: false,
        check_confirmPasswordInputChange: false,
        check_contactNumberInputChange: false,
        secureTextEntry: true,
        securePasswordEntry: true,
    })

    const setDefaults = () => {
        setData({
            ...data,
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            contactNumber: '',
            address: '',
            check_nameInputChange: false,
            check_emailInputChange: false,
            check_passwordInputChange: false,
            check_confirmPasswordInputChange: false,
            check_contactNumberInputChange: false,
            check_addressInputChange: false,
            secureTextEntry: true,
            securePasswordEntry: true,
        });
    }

    const nameInputChange = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                name: val,
                check_nameInputChange: true,
            });
        }
        else {
            setData({
                ...data,
                name: val,
                check_nameInputChange: false,
            });
        }
    }

    const emailInputChange = (val) => {
        if (val.length !== 0) {
            const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/;
            const result = pattern.test(val);

            if (result) {
                setData({
                    ...data,
                    email: val,
                    check_emailInputChange: true,
                });
            } else {
                setData({
                    ...data,
                    email: val,
                    check_emailInputChange: false,
                });
            }

        } else {
            setData({
                ...data,
                email: val,
                check_emailInputChange: false,
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
                check_passwordInputChange: true
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

    const contactNumberInputChange = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                contactNumber: val,
                check_contactNumberInputChange: true,
            });
        }
        else {
            setData({
                ...data,
                contactNumber: val,
                check_contactNumberInputChange: false,
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            securePasswordEntry: !data.securePasswordEntry
        });
    }

    const handleSignUp = () => {
        if (!data.check_passwordInputChange) {
            Alert.alert(
                "Password Error",
                "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
                [{ text: "ok" }],
                { cancelable: false }
            )
        } else if (data.check_nameInputChange && data.check_emailInputChange && data.check_passwordInputChange && data.check_confirmPasswordInputChange && data.check_contactNumberInputChange) {
            if (data.password === data.confirmPassword) {
                auth
                    .createUserWithEmailAndPassword(data.email, data.password)
                    .then(userCredentials => {
                        const user = userCredentials.user;
                        dbRef.doc(user.uid).set({
                            name: data.name,
                            email: data.email,
                            contactNumber: data.contactNumber,
                            chatIds: []
                        });
                        userCredentials.user.sendEmailVerification();
                        // auth.signOut();
                        setDefaults();
                        alert("Varification Email sent");
                        navigation.replace("Home");
                        // console.log("Registered in with ", user.email);
                        

                        // Alert.alert('Success', 'You are successfully registered', [{ text: 'OK' }]);
                        
                    })
                    .catch(error => {
                        console.log(error);
                    });

                // navigation.navigate('Home');
            }
            else {
                Alert.alert('Error', 'Password is not matched', [{ text: 'OK' }]);
            }
        }
        else {
            Alert.alert('Error', 'Please enter all the details', [{ text: 'OK' }]);
        }
    }

    return (
        <View style={styles.container}>
            {/* <Text>Open up App.js to start working on your app!</Text>    */}
            <View style={styles.header}>
                <Text style={styles.text_header}>Registration!</Text>
            </View>
            <Animatable.View
                animation='fadeInUp'
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
                        onChangeText={(val) => nameInputChange(val)}
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
                        onChangeText={(val) => emailInputChange(val)}
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

                {/* Password */}
                <Text style={[styles.text_footer, {
                    marginTop: 15
                }]}>Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        style={styles.textInput}
                        secureTextEntry={data.secureTextEntry ? true : false}
                        autoCapitalize="none"
                        onChangeText={(val) => handlePasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTextEntry}
                    >
                        {data.secureTextEntry ?
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


                {/* Check Password */}
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
                        secureTextEntry={data.securePasswordEntry ? true : false}
                        autoCapitalize="none"
                        onChangeText={(val) => confirmPasswordInputChange(val)}
                    />
                    <TouchableOpacity
                        onPress={updateConfirmSecureTextEntry}
                    >
                        {data.securePasswordEntry ?
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
                        keyboardType='phone-pad'
                        onChangeText={(val) => contactNumberInputChange(val)}
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



                {/* Sign Up Button */}
                <View style={styles.button}>

                    <LinearGradient
                        colors={['#009387', '#009387']}
                        style={styles.signIn}
                    >
                        <TouchableOpacity onPress={handleSignUp}>
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Sign Up</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </Animatable.View>
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
    }
});

export default Registration;
  