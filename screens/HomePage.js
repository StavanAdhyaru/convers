import {View,StyleSheet,Text} from 'react-native';

const HomePage = () => {
    return(
        <View style={styles.container}>
            <Text>HomePage</Text>
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
