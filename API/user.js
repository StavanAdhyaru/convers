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

const getSingleUserData = async (userId) => {
    try{
        let response = await userDBRef.doc(userId).get();
        console.log("User data 1",response.data());
        return response.data()
    }catch(error){
        console.log(error);
    }
}

const setUserStatus = async (userId,userData,activeOrNot) => {

    console.log("UserId:",userId)
    try{
        userDBRef.doc(userId).update({
            status: activeOrNot,
            name: userData.name,
            contactNumber: userData.contactNumber,
            email: userData.email,
            profileImageUrl: userData.profileImageUrl

        });
    }catch (error){
        console.log('error: ',error);
    }
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

const getMultipleChats = async (userId) => {

    let userChatwithUserId = [];
    let eachUserChatwithUserId = {};
    
    return new Promise((resolve, reject) => {
        try {
            userDBRef.doc(userId).collection("chatIdList").get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    eachUserChatwithUserId = doc.data();
                    eachUserChatwithUserId.userId = doc.id;
                    userChatwithUserId.push(eachUserChatwithUserId);
                })
            }).catch((error) => {
                reject(error);
            })
            
        } catch (error) {
            console.log('error: ', error);
            
        }
    })
}


export{ getUserDetails, getAllUsers, setUserStatus, getSingleUserData, getMultipleChats}