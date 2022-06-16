import { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
    Image,
    Button,
    Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { auth, fireDB, fireStorage } from "../firebase";
const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const UploadProfilePicture = () => {
    const currentUser = auth.currentUser
    const dbRef = fireDB.collection("users");
    const storageRef = fireStorage.ref('images/');
    const [photo, setPhoto] = useState("");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
        check_nameInputChange: false,
        check_emailInputChange: false,
        check_passwordInputChange: false,
        check_confirmPasswordInputChange: false,
        check_contactNumberInputChange: false,
        secureTextEntry: true,
        securePasswordEntry: true,
    });

    const setDefaults = () => {
        setData({
            ...data,
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            contactNumber: "",
            address: "",
            check_nameInputChange: false,
            check_emailInputChange: false,
            check_passwordInputChange: false,
            check_confirmPasswordInputChange: false,
            check_contactNumberInputChange: false,
            check_addressInputChange: false,
            secureTextEntry: true,
            securePasswordEntry: true,
        });
    };

    const handleChoosePhoto = async () => {
        try {
            console.log("inn handleChoosePhoto function");
            
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
              });
          
              console.log(result);
          
            if (!result.cancelled) {  
                setPhoto(result);
                
            }


        } catch (error) {
            console.log("error: ", error);
        }
    };

    const handleUploadPhoto = async () => {
        try {
            let uri = photo.uri;
            let uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
            console.log('uploadUri: ', uploadUri);
            const metadata = {
                contentType: 'image/jpeg'
            }
            storageRef.child(`${currentUser.uid}`).put(uploadUri, metadata).then((snapshot) => {
                console.log('snapshot: ');

            })

            // const storage = getStorage();
            //     const ref = ref(storage, '/images/');

            //     // convert image to array of bytes
            //     const image = await fetch(result.uri);
            //     const bytes = await image.blob();

            //     await uploadBytes(ref, bytes);
            
        } catch (error) {
            console.log('error: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInUp" style={styles.footer}>
                <View
                    style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                >
                    <Text>
                        {photo && (
                            <View>
                                <Image
                                    source={{ uri: photo.uri }}
                                    style={{ width: 300, height: 300 }}
                                />
                                <Button title="Upload Photo" onPress={handleUploadPhoto} />
                            </View>
                        )}
                        <View>
                            <Button title="Choose Photo" onPress={handleChoosePhoto} />
                        </View>
                    </Text>
                </View>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#9dd6f5",
    },
    header: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    footer: {
        flex: 6,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    text_header: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 30,
    },
    text_footer: {
        color: "#05375a",
        fontSize: 18,
    },

    logo: {
        width: height_logo,
        height: height_logo,
    },
    action: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#FF0000",
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === "ios" ? 0 : -3,
        paddingLeft: 10,
        color: "#05375a",
    },
    errorMsg: {
        color: "#FF0000",
        fontSize: 14,
    },
    button: {
        alignItems: "center",
        marginTop: 25,
    },
    signIn: {
        width: 340,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    textSign: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default UploadProfilePicture;
