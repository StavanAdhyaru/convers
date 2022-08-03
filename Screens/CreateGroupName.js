import { useEffect, useState } from 'react';
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
import { auth,storage } from "../firebase";
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import * as ImagePicker from 'expo-image-picker';

const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const CreateGroupName = ({navigation,route}) => {

    const [data, setData] = useState({
        groupName: '',
        groupId: uuidv4(),
        groupImageUrl: '',
        check_textInputChange: false,
    });
    const [photo, setPhoto] = useState('');
    const [url, setUrl] = useState('https://firebasestorage.googleapis.com/v0/b/convers-e6df7.appspot.com/o/group-user-img.jpeg?alt=media&token=df8dc433-e443-4bad-bd66-fb75c4fd431c');
    const textInputChange = (val) => {

        if (val.length >= 1) {
            setData({
                ...data,
                groupName: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                groupName: val,
                check_textInputChange: false
            });
        }
    }

    const goToAddPeoplePage = () => {
        if(data.check_textInputChange){
            navigation.navigate('AddPeopleInGroup',{
                groupName: data.groupName,
                groupImageUrl: data.groupImageUrl,
                groupId: data.groupId
            });
        }else{
            console.log("hi")
        }
    }

    const changeProfileImage = async () => {
        try {
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
    const uploadPhoto = (image) => {
        return new Promise( async (resolve, reject) => {
            try {
                // upload
                console.log('image argument:: ', image.uri);
                const response = await fetch(image.uri)
                const blob = await response.blob();
                var ref = storage.ref("images/").child(`${data.groupId}`);
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
            let tempUrl = await storage.ref("images").child(`${data.groupId}`).getDownloadURL();
            setUrl(tempUrl);
            console.log('new url: ', tempUrl);
            setData({
                ...data,
                groupImageUrl: tempUrl
            });
            
        } catch (error) {
            console.log('error: ', error);
        }
    }

    return(
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Create New Group!</Text>
            </View>
            <View>
                    <Image
                        source={{ uri: url }}
                        alt = {require(`../assets/default-user-image.png`)}
                        style={{ width: 170, height: 170, borderRadius: 100, alignSelf: "center" }}
                    />
                    <View style={styles.button}>
                    <TouchableOpacity 
                        onPress={changeProfileImage}
                    >
                        <Text style={[styles.textSign, {
                            color: '#ECCC01', padding: 10
                        }]}>Set Group image</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            <Animatable.View
                animation='fadeInUpBig'
                style={styles.footer}
            >
                <Text style={styles.text_footer}>Enter Name of the Group!</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="users"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        placeholder="Group Name"
                        style={styles.textInput}
                        autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                    />
                    {data.check_textInputChange ?
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
                <View style={styles.button}>

                    <TouchableOpacity onPress={goToAddPeoplePage}>
                        <LinearGradient
                            colors={['#08d4c4', '#01ab9d']}
                            style={styles.signIn}>
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Add People</Text>
                        </LinearGradient>
                    </TouchableOpacity>
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
        paddingBottom: 50,
    },
    footer: {
        flex: 3,
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
        marginTop: 50
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
export default CreateGroupName