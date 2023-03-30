import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

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

export { app };
