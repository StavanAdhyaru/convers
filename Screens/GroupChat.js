import {
    Container,
    Card,
    UserInfo,
    UserImgWrapper,
    UserImg,
    UserInfoText,
    UserName,
    PostTime,
    MessageText,
    TextSection,
} from './Styles/MessageStyles';
import { Animated } from 'react-native';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    Pressable,
    StatusBar,
    Alert,
    Button,
    Dimensions, Image, FlatList, Menu
} from 'react-native';

import { getUserDetails, getAllUsers, findUserEmail } from '../API/user';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';


const GroupChat = ({ navigation, route }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const [allUsers, setAllUsers] = useState([]);
    const currentUserId = auth.currentUser.uid;
    const [dataFromState, setData] = useState(null)



    const searchName = (input) => {
        let data = dataFromState;
        let searchData = data.filter((item) => {
            return item.userName.toLowerCase().includes(input.toLowerCase())
        });
        setData(searchData)
    }

    useEffect(() => {
        readUser();
    }, []);

    const readUser = async () => {
        const getUser = await getUserDetails(currentUserId);
        setCurrentUser(getUser);
    }


    return (
        <Container>
            <View style={styles.itemsearch}>

                <Feather style={styles.searchIcon}
                    name="search"
                    color="#009387"
                    size={20}
                />



                {/* SearchIcon = <SearchIcon/> */}
                <TextInput style={styles.searchText}
                    placeholder="Search Friend"
                    placeholderTextColor={"#009387"}
                    onChangeText={(input) => {
                        searchName(input)
                    }}
                // style={{ fontSize: 18 }}
                />


            </View>
        </Container>);
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
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
    },
    groupIcon:{
        marginLeft:80
        
    },
    searchIcon: {
        marginRight: 10
    },
    plus:{
        marginLeft:20
    },
    searchText: {
        marginLeft:10
    }
});

export default GroupChat;