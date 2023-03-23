// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyANqN__2HjQ_9YC4Fv0cigIO35gcJ_7wI4",
//   authDomain: "speak-up-a206d.firebaseapp.com",
//   projectId: "speak-up-a206d",
//   storageBucket: "speak-up-a206d.appspot.com",
//   messagingSenderId: "563219607865",
//   appId: "1:563219607865:web:39ea917f275642ab5bb8e8"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANqN__2HjQ_9YC4Fv0cigIO35gcJ_7wI4",
  authDomain: "speak-up-a206d.firebaseapp.com",
  projectId: "speak-up-a206d",
  storageBucket: "speak-up-a206d.appspot.com",
  messagingSenderId: "563219607865",
  appId: "1:563219607865:web:39ea917f275642ab5bb8e8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signup = document.getElementById('signup');
if (signup) {
    signup.addEventListener('click', (e) => {
        var firstname = document.getElementById('firstname').value;
        var lastname = document.getElementById('lastname').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                setDoc(doc(db, 'Users', user.uid), {
                    firstname: firstname,
                    lastname: lastname,
                    email: email
                });

                alert('User Created');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    });
}

const login = document.getElementById('login');
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });



