import { app } from "./config.js";
import { getFirestore, collection, doc, setDoc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

const fileInput = document.getElementById('file-upload');
if (fileInput) {
    fileInput.addEventListener('change', () => {
        uploadFile(fileInput.files);
    });
}

const uploadFile = (files) => {
  const formData = new FormData();
  formData.append('file', files[0]);

  let category;
  const physicalviolence = localStorage.getItem('physicalviolence');
  const sexualharrasment = localStorage.getItem('sexualharrasment');
  const mobjustice = localStorage.getItem('mobjustice');
  const domesticviolence = localStorage.getItem('domesticviolence');
  const genderbasedviolence = localStorage.getItem('genderbasedviolence');
  const anyotherform = localStorage.getItem('anyotherform');
  
  if (physicalviolence) {
    category = 'physicalviolence';
  } else if (sexualharrasment) {
    category = 'sexualharrasment';
  } else if (mobjustice) {
    category = 'mobjustice';
  } else if (domesticviolence) {
    category = 'domesticviolence';
  } else if (genderbasedviolence) {
    category = 'genderbasedviolence';
  } else if (anyotherform) {
    category = 'anyotherform';
  } else {
    // handle the case when no category is selected
      category = 'none';
      
  }
  
  const storageRef = ref(storage, files[0].name);
//   const fileRef = child(storageRef, files[0].name);
    const uploadTask = uploadBytesResumable(storageRef, files[0]);
  
  uploadTask.on('state_changed', (snapshot) => {
    // handle upload progress if needed
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload progress: ${progress}%`);
      
      
  }, (error) => {
      console.error(error);
        alert('Error adding report!');
      localStorage.clear();
        window.location = "/indexauthed.html";
  }, () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      // handle download URL of uploaded file
        console.log(`Download URL: ${downloadURL}`);

      onAuthStateChanged(auth, (user) => {
        if (user) {
          // save the data to Firestore
          const reportsCollection = collection(db, 'Reports');
          addDoc(reportsCollection, {
            uploadedby: user.email,
            category: category,
            fileURL: downloadURL,
            timestamp: new Date().toString()
          })
            .then(() => {
              console.log('Report added successfully!');
              alert('Report added successfully!');
              localStorage.clear();
              window.location = "/indexauthed.html";
            })
            .catch((error) => {
              console.error(error);
              alert('Error adding report!');
              localStorage.clear();
              window.location = "/indexauthed.html";
            });
        } else {
          // redirect to login page
          window.location = "/index.html";
        }
      });
    });
  });
}
