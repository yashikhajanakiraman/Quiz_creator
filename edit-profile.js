let topContainer = document.getElementById('topContainer');
let fNameElem = document.getElementById('fName');
let userEmailElem = document.getElementById('userEmail');
let userMobileElem = document.getElementById("userMobile");
let newPassElem = document.getElementById('newPassword');
let fName, userEmail, userMobile, newPass;

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, query, where, collection, addDoc, getDoc, getDocs, setDoc, updateDoc, onSnapshot, doc, deleteDoc } 
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

if(localStorage.getItem('userId') === null){
    alert("Please Login to Update the Profile");
    window.location.href = 'login-page.html';
}

let userRef = doc(db,'users',localStorage.getItem('userId'));
let userData = await getDoc(userRef);
let ud = userData.data();
userEmailElem.value = ud.email;
fNameElem.value = ud.fName;
if(ud.phone != null){
    userMobileElem.value = ud.phone;
}

function proceedToSave(){
    if(fNameElem.value.trim() === '' || userEmailElem.value.trim() === ''){
        alert("Name and Email Cannot be Empty !");
        return;
    }
    fName = fNameElem.value.trim();
    userEmail = userEmailElem.value.trim();
    if(userMobileElem.value !== '' && (userMobileElem.value.length != 10 || isNaN(Number(userMobileElem.value)))){
        alert("Invalid Mobile Number !");
        return;
    }else if(userMobileElem.value !== '' && !isNaN(Number(userMobileElem.value))){
        userMobile = Number(userMobileElem.value);
    }
    if(newPassElem.value.trim() !== '' && newPassElem.value.trim().length < 8){
        alert("Password should contain at least 8 charaters !");
        return;
    }else if(newPassElem.value.trim() !== '' && newPassElem.value.trim().length >= 8){
        newPass = newPassElem.value.trim();
    }
    console.log(userMobile,newPass);

    topContainer.innerHTML = "";
    let h1 = document.createElement('h1');
    h1.innerHTML = "Verify Your Current Password to Save Changes !";
    topContainer.appendChild(h1);
    topContainer.style.marginBottom = '2rem';
    let curPass = document.createElement('input');
    curPass.type = 'password';
    curPass.id = "currentPass";
    curPass.placeholder = "Existing Passoword Here...";
    let combi = document.createElement('div');
    combi.className = "combi";
    let h2 = document.createElement('h2');
    h2.innerHTML = "Current Password: ";
    combi.appendChild(h2);
    combi.appendChild(curPass);
    topContainer.appendChild(combi);
    let saveBtn = document.createElement('div');
    saveBtn.className = "explore-btn";
    saveBtn.innerHTML = "Save Changes";
    saveBtn.onclick = saveChanges;
    topContainer.appendChild(saveBtn);
}
window.proceedToSave = proceedToSave;

async function saveChanges(){
    let currentPass = document.getElementById('currentPass');
    if(ud.password === currentPass.value){
        let udoc = doc(db,'users',localStorage.getItem('userId'));
        try{
            console.log(fName,userEmail,userMobile,newPass);
            await updateDoc(udoc,{
                fName: fName,
                email: userEmail
            });
            if(userMobile !== undefined){
                await updateDoc(udoc, {
                    phone: userMobile
                });
            }
            if(newPass !== undefined){
                await updateDoc(udoc,{
                    password: newPass
                });
            }
            alert("Your Profile Details Updated !");
            window.location.href = "myprofile.html";
        }catch(error){
            console.log("Eror Caught: ",error);
        }
    }else{
        alert("Wrong Password !");
        return;
    }
}