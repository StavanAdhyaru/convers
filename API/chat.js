import { auth, fireDB, storage } from '../firebase';
// const loggedInUserId = auth.currentUser.uid;
const chatDBRef = fireDB.collection('chats');
// import { encryption, decryption } from './AES';

const storeChat = (chatId, message, loggedInUserId, isImage) => {
    console.log('chatId store chat: ', chatId);
    console.log('message: ', message);
    console.log('loggedInUserId', loggedInUserId);
    return new Promise(async (resolve, reject) => {
        try {
            if(!chatId) {
                let result = await chatDBRef.add({});
                let newChatId = result.path.split('/')[1];
                chatId = newChatId;
            }
            // let encryptedText = encryption(loggedInUserId, message.text);
            if(isImage) {
                let result = await chatDBRef.doc(chatId).collection('chatData').add({
                    userId: loggedInUserId,
                    // text: message.text,
                    createdAt: message.createdAt,
                    image: message.image
                })
            } else {
                let result = await chatDBRef.doc(chatId).collection('chatData').add({
                    userId: loggedInUserId,
                    text: message.text,
                    createdAt: message.createdAt
                })
            }
            resolve(chatId);
            
        } catch (error) {
            reject(error);
        }
    })
}

const storeChatForGroup = (chatId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // if(!chatId) {
            //     let result = await chatDBRef.add({});
            //     let newChatId = result.path.split('/')[1];
            //     chatId = newChatId;
            // }
            // let encryptedText = encryption(loggedInUserId, message.text);
            let result = await chatDBRef.doc(chatId).set({isGroup:true})
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

const deleteChat = async (chatId) => {
    try{
        console.log("Chat Id: ",chatId);
        await chatDBRef.doc(chatId).collection("chatData").get().then( async (snapshot) => {
            snapshot.forEach(chat => {
                chatDBRef.doc(chatId).collection("chatData").doc(chat.id).delete();
            });
        })
    }catch(error){
        console.log(error);
    }
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





export{ storeChat, getChat, deleteChat, storeChatForGroup };
