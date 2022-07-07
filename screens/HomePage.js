import { NavigationContainer } from '@react-navigation/native';
import {View,StyleSheet,Text} from 'react-native';

const HomePage = () => {
    return(
        <View style={styles.container}>
            <Text>HomePage</Text>
            <button onClick={() => navigation.replace("Chat")}></button>
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
});

export default HomePage;
