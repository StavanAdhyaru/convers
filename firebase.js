import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAZJJsBEZBPv1RJytybioCLxRApEUi9XKg",
    authDomain: "convers-5a5ea.firebaseapp.com",
    projectId: "convers-5a5ea",
    storageBucket: "convers-5a5ea.appspot.com",
    messagingSenderId: "368215477520",
    appId: "1:368215477520:web:00fe6791624779ae2ee995",
    measurementId: "G-PMWEDX1DDY"
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
const fireStorage = firebase.storage()

export { auth, fireDB, fireStorage };