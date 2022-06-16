import { LinearGradient } from 'expo-linear-gradient';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { auth, fireDB } from '../firebase';
const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const HomePage = ({ navigation }) => {
    const handleUploadPhoto = () => {
        navigation.replace('UploadProfilePicture');
    }

    const handleChatScreen = () => {
        navigation.replace('Chat');
    }

    const handleSettingsScreen = () => {
        navigation.replace('Settings');
    }

    return(
        <View style={styles.container}>
            <Text>HomePage</Text>
            <View style={styles.button}>
                <LinearGradient
                    colors={['#9dd6f5', '#83b3f2']}
                    style={styles.signIn}
                >
                    <TouchableOpacity onPress={handleUploadPhoto}>
                        <Text style={[styles.textSign, {
                            color: '#fff'
                        }]}>Upload photo</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <View style={styles.button}>
                <LinearGradient
                    colors={['#9dd6f5', '#83b3f2']}
                    style={styles.signIn}
                >
                    <TouchableOpacity onPress={handleChatScreen}>
                        <Text style={[styles.textSign, {
                            color: '#fff'
                        }]}>Chat</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <View style={styles.button}>
                <LinearGradient
                    colors={['#9dd6f5', '#83b3f2']}
                    style={styles.signIn}
                >
                    <TouchableOpacity onPress={handleSettingsScreen}>
                        <Text style={[styles.textSign, {
                            color: '#fff'
                        }]}>Settings</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>
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
    }
});

export default HomePage;
