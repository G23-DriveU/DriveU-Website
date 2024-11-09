// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
//   apiKey: "AIzaSyB5oNBWZHYq0nkLz1I3uQazvPo_m49flWk",
//   authDomain: "driveu-website.firebaseapp.com",
//   projectId: "driveu-website",
//   storageBucket: "driveu-website.firebasestorage.app",
//   messagingSenderId: "47628806572",
//   appId: "1:47628806572:web:26eb820abb381d74a23209",
//   measurementId: "G-CG9J6DN1H1"
    apiKey: "AIzaSyCMazrn3qI9npvUfWlgIVUFlmp6ZolV4DU",
    authDomain: "practice-auth-26b7c.firebaseapp.com",
    projectId: "practice-auth-26b7c",
    storageBucket: "practice-auth-26b7c.firebasestorage.app",
    messagingSenderId: "85539749575",
    appId: "1:85539749575:web:09dcbc35b4c4c75a2608e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };