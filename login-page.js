import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, query, where, collection, addDoc, getDoc, getDocs, setDoc, onSnapshot, doc, deleteDoc } 
from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyDR5OVjVSEP8wTL0bdlYu28f_dT6P7G1rU",
    authDomain: "quizzle-25.firebaseapp.com",
    projectId: "quizzle-25",
    storageBucket: "quizzle-25.firebasestorage.app",
    messagingSenderId: "577580316328",
    appId: "1:577580316328:web:24b5cb922ed86d7b58b49d",
    measurementId: "G-BYCGEN8X5S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let userEmail = document.getElementById('userEmail');
let userPassword = document.getElementById('userPassword');

async function logIn() {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", userEmail.value));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        alert("User not found");
        return;
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    if (data.password !== userPassword.value) {
        alert("Incorrect password");
        return;
    }

    localStorage.setItem("userId", docSnap.id);
    localStorage.setItem("email", data.email);
    window.location.href = 'myprofile.html';

}

window.logIn = logIn;

document.getElementById('userEmail').addEventListener('keydown',(event) => {
    if(event.key === 'Enter'){
        document.getElementById('userPassword').focus();
    }
})

document.getElementById('userPassword').addEventListener('keydown',(event) => {
    if(event.key === "Enter"){
        logIn();
    }
})