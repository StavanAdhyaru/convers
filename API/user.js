import {auth, fireDB, storage} from '../firebase';

const userDBRef = fireDB.collection('users');

const getUserDetails = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            userDBRef.doc(userId).get().then((doc) => {
                resolve(doc.data());
            }).catch((error) => {
                reject(error);
            })
            
        } catch (error) {
            console.log('error: ', error);
            
        }
    })
}

const getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        try {
            let userData = [];
            let eachUser = {};
            userDBRef.get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    eachUser = doc.data();
                    eachUser.id = doc.id;
                    userData.push(eachUser);
                    // console.log('userData: ', userData);
                })
                resolve(userData);

            }).catch((error) => {
                reject(error);
            })
            
        } catch (error) {
            console.log('error: ', error);
            
        }
    })
}

export{ getUserDetails, getAllUsers }