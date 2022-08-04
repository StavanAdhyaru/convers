import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

/**
 *      new firebase config
 *      nikki.alite@gmail.com 
 */

// const firebaseConfig = {
//   apiKey: "AIzaSyCU4LnDuMPSn4EPb8diTD4tJsvYgMUBtkw",
//   authDomain: "convers-65d21.firebaseapp.com",
//   projectId: "convers-65d21",
//   storageBucket: "convers-65d21.appspot.com",
//   messagingSenderId: "1016756170952",
//   appId: "1:1016756170952:web:ddc85eb03da7ca512035fd",
//   measurementId: "G-PF2C2BFRGZ"
// };

const firebaseConfig = {
    apiKey: "AIzaSyCdwRnqflnKbsKwWTRyucxxr5x6ALYhHXQ",
    authDomain: "convers-final.firebaseapp.com",
    projectId: "convers-final",
    storageBucket: "convers-final.appspot.com",
    messagingSenderId: "76689378131",
    appId: "1:76689378131:web:dfcb9db09fab922104afa6"
  };

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const auth = firebase.auth();
const fireDB = app.firestore();
const storage = firebase.storage()

export { auth, fireDB, storage };


