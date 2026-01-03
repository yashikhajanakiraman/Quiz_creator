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

let userRef = doc(db,'users',localStorage.getItem('userId'));
let userData = await getDoc(userRef);
let ud = userData.data();

async function getQuizDetails(){
    let qzCollection = collection(db,'quizzes');
    let q = query(qzCollection, where("createdBy","==",localStorage.getItem("userId")));
    try{
        const snapshot = await getDocs(q);
        if(snapshot.empty){
            return [];
        }
        const quizzes = [];
        snapshot.forEach((doc) => {
            quizzes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return quizzes;
    }catch(error){
        console.log("Error Caught: ",error);
    }
}
let quizDetails = await getQuizDetails();

if(quizDetails.length > 0){
   displayQuizDetails(); 
}

function displayQuizDetails(){
    document.getElementById('notFound').remove();
    let tBody = document.getElementById('fetched');
    quizDetails.forEach((qz) => {
        let tr = document.createElement('tr');
        let qId = document.createElement('td');
        qId.innerHTML = qz.id;
        let qName = document.createElement('td');
        qName.innerHTML = qz.quizName;
        let mode = document.createElement('td');
        mode.innerHTML = qz.mode;
        let totQuestion = document.createElement('td');
        totQuestion.innerHTML = qz.totalQuestions;
        tr.appendChild(qId);
        tr.appendChild(qName);
        tr.appendChild(mode);
        tr.appendChild(totQuestion);
        tBody.appendChild(tr);
    })
}
let gnQuizId;
let quizData;
const qidInput = document.getElementById('quizId');

qidInput.addEventListener('keydown', (event) =>{
    if(event.key === "Enter"){
        startDelete();
    }
})

async function startDelete(){
    

    quizDetails.forEach(qz => {
        if(qz.id === qidInput.value){
            quizData = qz;
        }
    });

    if(!quizData){
        alert("Wrong Quiz Id Entered !");
        return;
    }
    gnQuizId = qidInput.value;
    document.getElementById("delBtn").innerHTML = "Deleting...";
    const respo = confirm("Are you sure to Delete the Quiz ?");
    if(respo){
        await deleteDoc(doc(db,'quizzes',gnQuizId));
        alert(gnQuizId + " Deleted Successfully !!");
        window.location.href = 'myprofile.html';
    }else{
        alert("Quiz Deletion Aborted !!");
        window.location.href = 'myprofile.html';
    }
}
window.startDelete = startDelete;