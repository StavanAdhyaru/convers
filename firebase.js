import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCTtuA1kuTIleYDPeUlv9fDaAuASLSZaiY",
    authDomain: "convers-e6df7.firebaseapp.com",
    projectId: "convers-e6df7",
    storageBucket: "convers-e6df7.appspot.com",
    messagingSenderId: "800514410152",
    appId: "1:800514410152:web:fe8d70944650fc0a09249d"
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


