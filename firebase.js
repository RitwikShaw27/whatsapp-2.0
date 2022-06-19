import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCKSvND1Z3srCpAZRRU_stEUX3dE2OOKJg",
  authDomain: "whatsapp-2-28a1a.firebaseapp.com",
  projectId: "whatsapp-2-28a1a",
  storageBucket: "whatsapp-2-28a1a.appspot.com",
  messagingSenderId: "1074298784480",
  appId: "1:1074298784480:web:91df006825b072aa101e85",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
