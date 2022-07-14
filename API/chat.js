import { auth, fireDB, storage } from '../firebase';
// const loggedInUserId = auth.currentUser.uid;
const chatDBRef = fireDB.collection('chats');

const storeChat = (chatId, message, loggedInUserId) => {
    console.log('message: ', message);
    return new Promise(async (resolve, reject) => {
        try {
            let result = chatDBRef.doc(chatId).collection('chatData').add({
                userId: loggedInUserId,
                text: message.text,
                createdAt: message.createdAt
            })
            resolve(result);
            
        } catch (error) {
            reject(error);
        }
    })
}

const getChat = (chatId) => {
    return new Promise((resolve, reject) => {
        try {
            let allChat = chatDBRef.doc(chatId).collection('chatData').onSnapshot((querySnapshot) => {
                const messagesFromFirestore = querySnapshot.docChanges().map(({doc}) => {
                    const message = doc.data();
                    return { 
                        _id: doc.id,    // chatId
                        ...message, 
                        createdAt: message.createdAt.toDate()
                    }
                }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                resolve(messagesFromFirestore);
            })
            
        } catch (error) {
            reject(error);
        }
    })
}





export{ storeChat, getChat };