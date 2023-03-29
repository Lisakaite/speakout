import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

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
const provider = new GoogleAuthProvider(app);

const signup = document.getElementById('signup');
if (signup) {
    signup.addEventListener('click', (e) => {
        var firstname = document.getElementById('firstname').value;
        var lastname = document.getElementById('lastname').value;
        var email = document.getElementById('email').value;
        var photoURL = ""
        var password = document.getElementById('password').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                setDoc(doc(db, 'Users', user.uid), {
                    name: firstname + " " + lastname,
                    email: email,
                    photoURL: photoURL
                })
                    .then(() => {
                        alert("Login Successfull");
                        window.location = "/index.html"
                        localStorage.clear();
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        alert(errorMessage);
                        localStorage.clear();
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
                localStorage.clear();
            });
    });
}

const login = document.getElementById('login');
if (login) {
    login.addEventListener('click', (e) => {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                const userRef = doc(db, 'Users', user.uid);
                updateDoc(userRef, {
                    last_login: new Date().toString()
                })
                    .then(() => {
                        alert("Login Successfull");
                        window.location = "/index.html"
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        alert(errorMessage);
                    });

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    });
}

// Attach click event listener to Google sign-in button
const googleSignInButton = document.getElementById('googlesignin');
if (googleSignInButton) { 
    googleSignInButton.addEventListener('click', (e) => {
        signInWithRedirect(auth, provider);
    });
}

// Call getRedirectResult before attaching click event listener
getRedirectResult(auth)
    .then((result) => {
        if (result && result.user) {
            // User is signed in, save user data to Firestore
            setDoc(doc(db, 'Users', result.user.uid), {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL
            });

            updateDoc(doc(db, 'Users', result.user.uid), {
                last_login: new Date().toString()
            })
                .then(() => {
                    alert("Login Successfull");
                    window.location = "/index.html"
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
        }
    })
    .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
    });

// const googleSignInButton = document.getElementById('googlesignin');
// if (googleSignInButton) {
//     googleSignInButton.addEventListener('click', (e) => {
//         signInWithPopup(auth, provider)
//             .then((result) => {
//                 // This gives you a Google Access Token. You can use it to access the Google API.
//                 const credential = GoogleAuthProvider.credentialFromResult(result);
//                 const token = credential.accessToken;
//                 // The signed-in user info.
//                 const user = result.user;

//                 // Save user data to Firestore
//                 setDoc(doc(db, 'Users', user.uid), {
//                     name: user.displayName,
//                     email: user.email,
//                     photoURL: user.photoURL
//                 });

//                 // IdP data available using getAdditionalUserInfo(result)
//                 // ...
//             }).catch((error) => {
//                 // Handle Errors here.
//                 const errorCode = error.code;
//                 const errorMessage = error.message;
//                 // The email of the user's account used.
//                 const email = error.customData.email;
//                 // The AuthCredential type that was used.
//                 const credential = GoogleAuthProvider.credentialFromError(error);
//                 // ...
//             });
//     });
// }

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
    } else {
        // User is signed out
        // ...
    }
});

const logout = document.getElementById('logout');
if (logout) {
    logout.addEventListener('click', (e) => {
        signOut(auth).then(() => {
            // Sign-out successful.
            alert('Logged Out Successfully');
            window.location = "/login.html";
        }).catch((error) => {
            // An error happened.
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    });
}




    


