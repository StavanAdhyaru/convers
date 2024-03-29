import { auth, fireDB, storage } from '../Firebase';
import { getChat } from './Chat'
const userDBRef = fireDB.collection('users');

const getUserDetails = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const data = userDBRef.doc(userId).get().then((doc) => {
                resolve(doc.data());
            }).catch((error) => {
                reject(error);
            })

        } catch (error) {
            console.log('error: ', error);

        }
    })
}

const getGroupDetails = async (groupId) => {
    return new Promise((resolve, reject) => {
        try {
            const data = fireDB.collection("groups").doc(groupId).get().then((doc) => {
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
    try {
        let response = await userDBRef.doc(userId).get();
        console.log("User data 1", response.data());
        return response.data()
    } catch (error) {
        console.log(error);
    }
}

const findUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        try {
            userDBRef.where('email', '==', email).get().then((snapshot) => {
                if (snapshot.isempty) {
                    console.log('No matching documents.');
                }
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    return doc.data();
                });
            });
        } catch (error) {
            console.log("Errroror : ", error)
        }
    })
}

const setUserStatus = async (userId, userData, activeOrNot) => {

    console.log("UserId:", userId)
    try {
        userDBRef.doc(userId).update({
            status: activeOrNot
        });
    } catch (error) {
        console.log('error: ', error);
    }
}

const getAllUsers = async (currentUserid) => {
    return new Promise((resolve, reject) => {
        try {
            let userData = [];
            userDBRef.doc(currentUserid).collection("chatIdList").onSnapshot((querySnapshot) => {
                const eachUserConnected = querySnapshot.docChanges().map(async ({ doc }) => {
                    const eachUser = doc.data();
                    eachUser.id = doc.id;
                    eachUser.userData = await getUserDetails(doc.id);
                    eachUser.chatData = await getChat(eachUser.chatId);
                    userData.push(eachUser);
                })
                console.log(userData);
                resolve(userData);

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
            let result1 = await userDBRef.doc(userId).collection("chatIdList").doc(loggedInUserId).set({ chatId: newChatId });
            let result2 = await userDBRef.doc(loggedInUserId).collection("chatIdList").doc(userId).set({ chatId: newChatId });
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
            console.log('doc.data(): ', doc.data());
            if (doc.data()) {
                resolve(doc.data().chatId);
            }
            resolve(null);

        } catch (error) {
            reject(error);
        }
    })
}

const savePushNotificationToken = (userId, token) => {
    return new Promise((resolve, reject) => {
        try {
            let saveToken = userDBRef.doc(userId).update({ pushToken: token })
            resolve(saveToken);

        } catch (error) {
            reject(error);
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

export { getUserDetails, getAllUsers, addChatId, getChatId, setUserStatus, getSingleUserData, getMultipleChats, savePushNotificationToken, findUserByEmail, getGroupDetails }
