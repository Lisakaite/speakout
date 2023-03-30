import { app } from "./config.js";
import { getFirestore, collection, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const db = getFirestore(app);