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

let currentQ = 1;
const questionsContainer = document.querySelector('.questions');


let userRef = doc(db,'users',localStorage.getItem('userId'));
let userData = await getDoc(userRef);
let ud = userData.data();

let TOTAL_QUESTIONS = 0; 

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

function hideAllQuestions() {
    document.querySelectorAll('.questCont').forEach(q => {
        q.style.display = 'none';
    });
}

function showQuestion(qid) {
    hideAllQuestions();
    const q = document.getElementById(`Q${qid}`);
    if (q) {
        q.style.display = 'block';
        currentQ = qid;
    }
}

function addPreviousButton(btnCont, qid) {
    if (qid > 1 && !btnCont.querySelector('.prev')) {
        const prev = document.createElement('div');
        prev.className = 'btn prev';
        prev.innerText = 'Previous';
        prev.onclick = () => showQuestion(qid - 1);
        btnCont.prepend(prev);
    }
}

function saveAndNext(event) {
    const parentQ = event.target.closest('.questCont');
    const qid = Number(parentQ.id.replace('Q', '')); // 1-based
    const index = qid - 1; // 0-based for arrays

    // 🔍 Fetch elements
    const questionEl = parentQ.querySelector('#question');
    const optionsEl = parentQ.querySelectorAll('.opt');
    const correctEl = parentQ.querySelector('#correct');
    const hintEl = parentQ.querySelector('#hint');

    // ---------------- VALIDATION ----------------
    if (!questionEl.value.trim()) {
        alert(`Question ${qid}: Question cannot be empty`);
        return;
    }

    const opts = [];
    for (let opt of optionsEl) {
        if (!opt.value.trim()) {
            alert(`Question ${qid}: All options must be filled`);
            return;
        }
        opts.push(opt.value.trim());
    }

    if (!correctEl.value) {
        alert(`Question ${qid}: Please select the correct answer`);
        return;
    }

    // ---------------- UPDATE quizData ----------------
    // Question
    quizData.questions[index] = questionEl.value.trim();

    // Options (options object is 1-based)
    quizData.options[qid] = opts;

    // Correct answer
    quizData.correctAnswers[index] = correctEl.value;

    // Hint (optional)
    quizData.hints[index] = hintEl.value.trim();

    // ---------------- NAVIGATION ----------------
    hideAllQuestions();

    const nextQid = qid + 1;
    const nextQ = document.getElementById(`Q${nextQid}`);

    if (nextQ) {
        nextQ.style.display = 'block';
        currentQ = nextQid;
        handleSaveQuizButton(nextQid);
    }
}



let quizData;
let gnQuizId;
function startEdit(){
    const qidInput = document.getElementById('quizId');

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
    TOTAL_QUESTIONS = quizData.totalQuestions;

    // ❌ hide intro
    document.getElementById('first').style.display = 'none';

    // ✅ SHOW questions container
    document.querySelector('.questions').style.removeProperty('display');

    // build editor
    buildEditorFromQuiz(quizData);
}
window.startEdit = startEdit;

function buildEditorFromQuiz(quizData) {

    for (let i = 0; i < quizData.totalQuestions; i++) {
        const qNo = i + 1;
        const qCont = construct(`Q${qNo}`);

        // Fill data
        qCont.querySelector('#question').value = quizData.questions[i];

        const opts = quizData.options[qNo];
        qCont.querySelector('#A').value = opts[0];
        qCont.querySelector('#B').value = opts[1];
        qCont.querySelector('#C').value = opts[2];
        qCont.querySelector('#D').value = opts[3];

        qCont.querySelector('#correct').value = quizData.correctAnswers[i];
        qCont.querySelector('#hint').value = quizData.hints[i] || "";

        // Add Previous button
        addPreviousButton(qCont.querySelector('#btnCont'), qNo);

        questionsContainer.appendChild(qCont);
    }

    hideAllQuestions();
    document.getElementById('Q1').style.display = 'block';
}



function construct(qid) {
    const questCont = document.createElement("div");
    questCont.className = "questCont";
    questCont.id = qid;

    const qno = document.createElement("div");
    qno.id = "qno";
    qno.textContent = qid.replace(/\D/g, "") || "";
    
    const question = document.createElement("textarea");
    question.id = "question";
    question.placeholder = "Question Goes Here...";

    const options = document.createElement("div");
    options.className = "options";

    const optionData = [
        { placeholder: "A Option", id: "A" },
        { placeholder: "B Option", id: "B" },
        { placeholder: "C Option", id: "C" },
        { placeholder: "D Option", id: "D" }
    ];

    optionData.forEach(opt => {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "opt";
        input.placeholder = opt.placeholder;
        input.id = opt.id;
        options.appendChild(input);
    });

    const hint = document.createElement("input");
    hint.type = "text";
    hint.id = "hint";
    hint.placeholder = "Hint Goes Here...";

    const btnCont = document.createElement("div");
    btnCont.id = "btnCont";

    const nxt = document.createElement("div");
    nxt.id = "nxt";
    nxt.className = "btn";
    nxt.onclick = saveAndNext;
    nxt.textContent = "Save and Next";

    btnCont.appendChild(nxt);
    const correctSelect = document.createElement("select");
    correctSelect.id = "correct";

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Select Correct Answer";
    defaultOpt.disabled = true;
    defaultOpt.selected = true;

    correctSelect.appendChild(defaultOpt);

    ["A", "B", "C", "D"].forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        correctSelect.appendChild(option);
    });


    questCont.appendChild(qno);
    questCont.appendChild(question);
    questCont.appendChild(options);
    options.appendChild(correctSelect);
    questCont.appendChild(hint);
    questCont.appendChild(btnCont);

    return questCont;
}
window.construct = construct;

function handleSaveQuizButton(qid) {
    // Remove existing save buttons
    document.querySelectorAll('.saveQuiz').forEach(btn => btn.remove());

    if (qid === TOTAL_QUESTIONS) {
        const btnCont = document
            .getElementById(`Q${qid}`)
            .querySelector('#btnCont');

        const saveBtn = document.createElement('div');
        saveBtn.className = 'btn saveQuiz';
        saveBtn.innerText = 'Save Quiz';
        saveBtn.onclick = saveQuiz; // 🔥 your firebase save logic

        btnCont.appendChild(saveBtn);
    }
}

async function saveQuiz(){
    const quizRef = doc(db,'quizzes',gnQuizId);
    try{
        hideAllQuestions();
        let saving = document.getElementById('saving');
        saving.style.removeProperty('display');
        await updateDoc(quizRef,quizData);
        document.getElementById('saveImg').src = "Assets/Images/tik.gif";
        saving.querySelector('h1').innerHTML = "Your Quiz Details Updated Successfully !!";
        let redirBtn = document.createElement('div');
        redirBtn.innerHTML = "Back to Dashboard";
        redirBtn.className = "createBtn";
        redirBtn.onclick = () => {
            window.location.href = 'myprofile.html';
        }
        saving.appendChild(redirBtn);
    }catch(error){
        console.log("Error Caught: ",error);
    }
}

