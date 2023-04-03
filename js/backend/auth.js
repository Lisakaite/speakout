import { app } from "./config.js";
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

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
                        alert("User Created");
                        window.location = "/login.html"
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
                        window.location = "/indexauthed.html"
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
                    window.location = "/indexauthed.html"
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

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    const allowedUrls = [
      '/indexauthed.html',
      '/category.html',
      '/reportnow.html',
      '/aboutusauthed.html',
      '/safezonesauthed.html',
      '/profile.html',
    ];
    const currentUrl = window.location.pathname;

    if (!allowedUrls.includes(currentUrl)) {
      // Redirect to authed page if not already there
      window.location = '/indexauthed.html';
    } else {
      // Update profile information
      const profileImg = document.querySelector('.col-md-3 img');
      const profileName = document.querySelector('.col-md-9 h3');

      // Get user information from Firebase Auth
      // const db = getFirestore();
      const userRef = doc(db, 'Users', uid);
      getDoc(userRef)
        .then((doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            // Update profile image and name
            profileImg.src = userData.photoURL || '/img/avatar.png';
            profileName.textContent = userData.name || 'Anonymous';
          }
        })
        .catch((error) => {
          console.log('Error getting user document:', error);
        });

        // Get the number of cases reported by the user
        const reportsRef = collection(db, 'Reports');
        const filteredReports = query(reportsRef, where('uploadedby', '==', user.email)); // or getDocs(query(reportsRef))
        const querySnapshot = await getDocs(filteredReports);
        try {
                document.getElementById('numCases').textContent = querySnapshot.size;
            } catch (error) {
                console.log('Error getting reports:', error);
            }
        
        // // Get the files reported by the user
        // const container = document.getElementById('reported-cases-container');
        // let row = null;

        // querySnapshot.forEach((doc, index) => {
        //     const data = doc.data();
        //     const fileUrl = data.fileUrl;

        //     // Create a card for the reported file
        //     const card = document.createElement("div");
        //     card.className = "card h-100";

        //     let fileElement = null;

        //     if (fileUrl) {
        //         const extension = fileUrl.split('.').pop();

        //         if (extension.endsWith('mp4') || extension.endsWith('ogg') || extension.endsWith('webm')) {
        //         // Create video element
        //         fileElement = document.createElement('video');
        //         fileElement.src = fileUrl;
        //         fileElement.controls = true;
        //         fileElement.style = "height: 100%; object-fit: cover;";
        //         } else if (extension.endsWith('mp3') || extension.endsWith('wav') || extension.endsWith('ogg')) {
        //         // Create audio element
        //         fileElement = document.createElement('audio');
        //         fileElement.src = fileUrl;
        //         fileElement.controls = true;
        //         } else if (extension.endsWith('png') || extension.endsWith('jpg') || extension.endsWith('jpeg') || extension.endsWith('gif')) {
        //         // Create image element
        //         fileElement = document.createElement('img');
        //         fileElement.src = fileUrl;
        //         fileElement.alt = "Reported file";
        //         fileElement.style = "height: 100%; object-fit: cover;";
        //         } else if (extension.endsWith('pdf')) {
        //         // Create iframe for PDF
        //         fileElement = document.createElement('iframe');
        //         fileElement.src = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
        //         fileElement.style = "height: 100%; object-fit: cover;";
        //         } else {
        //         // Create link to file
        //         fileElement = document.createElement('a');
        //         fileElement.href = fileUrl;
        //         fileElement.target = '_blank';
        //         fileElement.textContent = 'Download file';
        //         }
        //     } else {
        //         // Display placeholder image
        //         fileElement = document.createElement('img');
        //         fileElement.src = '/img/v.png';
        //         fileElement.alt = "Reported file";
        //         fileElement.style = "height: 100%; object-fit: cover;";
        //     }

        //     const cardFooter = document.createElement("div");
        //     cardFooter.className = "card-footer";

        //     // Append elements to the card
        //     card.appendChild(fileElement);
        //     card.appendChild(cardFooter);

        //     // Add card to a row container
        //     if (index % 3 === 0) {
        //         row = document.createElement('div');
        //         row.className = 'row';
        //         container.appendChild(row);
        //     }
        //     const col = document.createElement('div');
        //     col.className = 'col-md-4 col-6';
        //     col.appendChild(card);
        //     row.appendChild(col);
        // });

    }
    } else {
        // User is signed out
        const allowedUrls = [
        '/login.html',
        '/aboutus.html',
        '/safezones.html',
        '/index.html',
        '/jointhemovt.html',
        '/twostepper.html',
        ];
        const currentUrl = window.location.pathname;

        if (!allowedUrls.includes(currentUrl)) {
        // Redirect to login page if not already there
        window.location = '/index.html';
        }
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




    


