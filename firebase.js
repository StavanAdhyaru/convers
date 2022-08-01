import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
// import { getMessaging } from 'firebase/messaging';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyAZJJsBEZBPv1RJytybioCLxRApEUi9XKg",
//     authDomain: "convers-5a5ea.firebaseapp.com",
//     projectId: "convers-5a5ea",
//     storageBucket: "convers-5a5ea.appspot.com",
//     messagingSenderId: "368215477520",
//     appId: "1:368215477520:web:00fe6791624779ae2ee995",
//     measurementId: "G-PMWEDX1DDY"
//   };

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
// const messaging = firebase.messaging(app);
// const messaging = getMessaging(app);

export { auth, fireDB, storage };


