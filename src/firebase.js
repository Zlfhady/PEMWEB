import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCyk4jwYCCoB0vKBJzLC8nBsOvh3OAQks4",
    authDomain: "uas-pemweb-eaf2a.firebaseapp.com",
    projectId: "uas-pemweb-eaf2a",
    storageBucket: "uas-pemweb-eaf2a.appspot.com",
    messagingSenderId: "525469590568",
    appId: "1:525469590568:web:f43ca126672e6b52a9c11d"
  };



const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };