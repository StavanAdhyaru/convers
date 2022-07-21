import {auth, fireDB, storage} from '../firebase';
import {getChat} from './chat'
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
            // name: userData.name,
            // contactNumber: userData.contactNumber,
            // email: userData.email,
            // profileImageUrl: userData.profileImageUrl

        });
    }catch (error){
        console.log('error: ',error);
    }
}

const getAllUsers = async (currentUserid) => {
    return new Promise((resolve, reject) => {
        try {
            let userData = [];
            // userDBRef.doc(currentUserid).collection("chatIdList").get().then((snapshot) => {
            //     snapshot.forEach(async (doc) => {
            //         eachUser = doc.data();
            //         eachUser.id = doc.id;
            //         eachUser.userData =  getUserDetails(doc.id);
            //         eachUser.chatData =  getChat(eachUser.chatId);
            //         userData.push(eachUser);
            //     })
            //     resolve(userData);
            // }).catch((error) => {
            //     reject(error);
            // })  
            
            userDBRef.doc(currentUserid).collection("chatIdList").onSnapshot((querySnapshot) => {
                const eachUserConnected = querySnapshot.docChanges().map(async ({doc}) => {
                    const eachUser = doc.data();
                    eachUser.id = doc.id;
                    eachUser.userData = await getUserDetails(doc.id);
                    eachUser.chatData = await getChat(eachUser.chatId);
                    // console.log("each User",eachUser);
                    userData.push(eachUser);
                })
                console.log(userData);
                resolve(userData);
                // return userData;
            // })
            }).catch((error) => {
                reject(error);
            })
        } catch (error) {
            console.log('error: ', error);
            
        }
    })
}

const addChatId = (userId, loggedInUserId, newChatId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result1 = await userDBRef.doc(userId).collection("chatIdList").doc(loggedInUserId).set({chatId: newChatId});
            let result2 = await userDBRef.doc(loggedInUserId).collection("chatIdList").doc(userId).set({chatId: newChatId});
            resolve(result2);
            
        } catch (error) {
            reject(error);
        }
    })
}

const getChatId = (loggedInUserId, userId) => {
    console.log('loggedInUserId, userId: ', loggedInUserId, userId);
    return new Promise(async (resolve, reject) => {
        try {
            let doc = await userDBRef.doc(loggedInUserId).collection('chatIdList').doc(userId).get()
            resolve(doc.data().chatId);
            
        } catch (error) {
            reject(error);
        }
    })
}

// const addPushNotificationToken = (userId, token) => {
//     return new Promise((resolve, reject) => {
//         try {
            
            
//         } catch (error) {
//             reject(error);
//         }
//     }
// }

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
                    console.log(eachUserChatwithUserId);
                })
                resolve(userChatwithUserId);
            }).catch((error) => {
                reject(error);
            })
            
        } catch (error) {
            console.log('error: ', error);
            
        }
    })
}

export{ getUserDetails, getAllUsers, addChatId, getChatId, setUserStatus, getSingleUserData, getMultipleChats }