import { auth, fireDB, storage } from '../firebase';
// const loggedInUserId = auth.currentUser.uid;
const chatDBRef = fireDB.collection('chats');

const storeChat = (chatId, message, loggedInUserId) => {
    console.log('chatId: ', chatId);
    console.log('message: ', message);
    return new Promise(async (resolve, reject) => {
        try {
            if(!chatId) {
                let result = await chatDBRef.add({});
                let newChatId = result.path.split('/')[1];
                chatId = newChatId;
            }
            let result = await chatDBRef.doc(chatId).collection('chatData').add({
                userId: loggedInUserId,
                text: message.text,
                createdAt: message.createdAt
            })
            resolve(chatId);
            
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

// const createChat = () => {
//     return new Promise((resolve, reject) => {
//         try {
//             let newChat = chatDBRef.add({});
//             console.log('newChat: ', newChat);
            
//         } catch (error) {
//             reject(error);
            
//         }
//     })
// }



export{ storeChat, getChat };