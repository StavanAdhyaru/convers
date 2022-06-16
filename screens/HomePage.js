import {View,StyleSheet,Text,Button} from 'react-native';

const HomePage = ({navigation}) => {
    return(
        <View style={styles.container}>
            <Text>HomePage</Text>

            <Button title="Chat" onPress={() => navigation.navigate('Chat')}/>
            <Button title="Settings" onPress={() => {
                navigation.navigate('Settings');
            }
            }/>
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
