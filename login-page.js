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

async function logIn(){
    if(userEmail.value.trim() === userEmail.value && userPassword.value.trim() === userPassword.value){
        const userRef = collection(db,'users');
        const q = query(userRef,where('email','==',userEmail.value))
        const queryRes = await getDocs(q);
        if(queryRes.empty){
            alert("Wrong Email Provided !")
        }else{
            const userDoc = queryRes.docs[0];
            const userData = userDoc.data();
            if(userPassword.value == userData.password){
                alert("Login Success !");
            }else{
                alert("Wrong Password Provided !")
            }
        }
    }else{
        alert("Remove the Leading spaces for email and password");
    }
}
window.logIn = logIn;