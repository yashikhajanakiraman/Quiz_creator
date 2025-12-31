let seletedMode = 'Public';
let questionsContainer = document.getElementsByClassName('questions')[0];
let topContainer = document.getElementsByClassName('top-container')[0];
let quizName = document.getElementById('quizName');
let first = document.getElementById('first');

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


function modeSpecify(event){
    let mdPublic = document.getElementById('mdPublic');
    let mdPrivate = document.getElementById('mdPrivate');
    if(event.target.innerHTML == "Public"){
        mdPublic.classList.add('Mactive');
        mdPrivate.classList.remove('Mactive');
        seletecMode = "Public";
    }else{
        mdPrivate.classList.add('Mactive');
        mdPublic.classList.remove('Mactive');
        seletedMode = "Private";
    }
}
window.modeSpecify = modeSpecify;


function construct(qid) {
    // Main container
    const questCont = document.createElement("div");
    questCont.className = "questCont";
    questCont.id = qid;

    // Question number
    const qno = document.createElement("div");
    qno.id = "qno";
    qno.textContent = qid.replace(/\D/g, "") || "";
    
    // Question textarea
    const question = document.createElement("textarea");
    question.id = "question";
    question.placeholder = "Question Goes Here...";

    // Options container
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

    // Hint input
    const hint = document.createElement("input");
    hint.type = "text";
    hint.id = "hint";
    hint.placeholder = "Hint Goes Here...";

    // Button container
    const btnCont = document.createElement("div");
    btnCont.id = "btnCont";

    const nxt = document.createElement("div");
    nxt.id = "nxt";
    nxt.className = "btn";
    nxt.onclick = saveAndNext;
    nxt.textContent = "Save and Next";

    btnCont.appendChild(nxt);
    // Correct answer selector
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


    // Assemble everything
    questCont.appendChild(qno);
    questCont.appendChild(question);
    questCont.appendChild(options);
    options.appendChild(correctSelect);
    questCont.appendChild(hint);
    questCont.appendChild(btnCont);

    return questCont;
}
window.construct = construct;

function createQuiz() {
    if(quizName.value.trim() === ''){
        alert("Enter the Quiz Name !");
        return;
    }
    first.style.display = 'none';
    questionsContainer.style.removeProperty('display');

    // Reset state (important if user refreshes or re-enters)
    currentQ = 1;

    // Create first question
    const q1 = construct('Q1');
    questionsContainer.appendChild(q1);

    // Show only Q1
    hideAllQuestions();
    q1.style.display = 'block';

    // Ensure buttons are correct
    handleSaveQuizButton(1);
}
window.createQuiz = createQuiz;

let currentQ = 1;
const MIN_QUESTIONS = 5;

/* Utility: hide all questions */
function hideAllQuestions() {
    document.querySelectorAll('.questCont').forEach(q => {
        q.style.display = 'none';
    });
}

/* Utility: get question container */
function getQ(qid) {
    return document.getElementById(`Q${qid}`);
}

/* Add Previous button if needed */
function addPreviousButton(btnCont, qid) {
    if (qid > 1 && !btnCont.querySelector('.prev')) {
        const prev = document.createElement('div');
        prev.className = 'btn prev';
        prev.textContent = 'Previous';
        prev.onclick = () => showQuestion(qid - 1);
        btnCont.prepend(prev);
    }
}

/* Handle Save Quiz button placement */
function handleSaveQuizButton(currentQid) {
    // Remove Save Quiz from all containers
    document.querySelectorAll('.saveQuiz').forEach(btn => btn.remove());

    const totalQuestions =
        questionsContainer.querySelectorAll('.questCont').length;

    // Show Save Quiz ONLY if:
    // 1) Minimum questions reached
    // 2) This is the LAST question
    if (totalQuestions >= MIN_QUESTIONS && currentQid === totalQuestions) {
        const btnCont = getQ(currentQid).querySelector('#btnCont');

        const save = document.createElement('div');
        save.className = 'btn saveQuiz';
        save.textContent = 'Save Quiz';
        save.onclick = saveQuiz;

        btnCont.appendChild(save);
    }
}


/* Show specific question */
function showQuestion(qid) {
    hideAllQuestions();
    const q = getQ(qid);
    if (q) {
        q.style.display = 'block';
        currentQ = qid;
        handleSaveQuizButton(qid);
    }
}

/* Save and Next */
function saveAndNext(event) {
    const parentQ = event.target.closest('.questCont');

    // Scoped access
    const question = parentQ.querySelector('#question');
    const options = parentQ.querySelectorAll('.opt');
    const correct = parentQ.querySelector('#correct');

    // Trimmed values
    const questionVal = question.value.trim();
    const correctVal = correct.value;

    let isValid = true;

    // Question check
    if (!questionVal) {
        isValid = false;
    }

    // Options check
    options.forEach(opt => {
        if (!opt.value.trim()) {
            isValid = false;
        }
    });

    // Correct answer check
    if (!correctVal) {
        isValid = false;
    }

    // Stop navigation if invalid
    if (!isValid) {
        alert('Please fill the question, all options, and select the correct answer.');
        return;
    }

    // ---------- navigation logic ----------
    const qid = Number(parentQ.id.replace('Q', ''));
    const nextQid = qid + 1;

    hideAllQuestions();

    let nextQ = getQ(nextQid);

    if (!nextQ) {
        nextQ = construct(`Q${nextQid}`);
        questionsContainer.appendChild(nextQ);

        const btnCont = nextQ.querySelector('#btnCont');
        addPreviousButton(btnCont, nextQid);
    }

    nextQ.style.display = 'block';
    currentQ = nextQid;

    handleSaveQuizButton(nextQid);
}

window.saveAndNext = saveAndNext;

async function saveQuiz() {
    const questionsArr = [];
    const optionsObj = {};
    const correctAnswersArr = [];
    const hintsArr = []; // ✅ NEW: hints array

    const allQuestions = document.querySelectorAll('.questCont');

    for (let i = 0; i < allQuestions.length; i++) {
        const qCont = allQuestions[i];
        const qNo = i + 1;

        const questionEl = qCont.querySelector('#question');
        const options = qCont.querySelectorAll('.opt');
        const correctEl = qCont.querySelector('select');
        const hintEl = qCont.querySelector('#hint'); // ✅ NEW

        // Final safety validation
        if (!questionEl || !correctEl || !hintEl) {
            alert(`Question ${qNo} structure is invalid.`);
            return;
        }

        const question = questionEl.value.trim();
        const correct = correctEl.value;
        const hint = hintEl.value.trim(); // ✅ NEW (can be empty)

        if (!question || !correct) {
            alert(`Question ${qNo} is incomplete.`);
            return;
        }

        const optionValues = [];
        let optionsValid = true;

        options.forEach(opt => {
            if (!opt.value.trim()) {
                optionsValid = false;
            }
            optionValues.push(opt.value.trim());
        });

        if (!optionsValid) {
            alert(`Options missing in Question ${qNo}`);
            return;
        }

        // Push data
        questionsArr.push(question);
        optionsObj[qNo] = optionValues;
        correctAnswersArr.push(correct);
        hintsArr.push(hint); // ✅ NEW
    }

    // Debug (optional)
    console.log("Questions:", questionsArr);
    console.log("Options Map:", optionsObj);
    console.log("Correct Answers:", correctAnswersArr);
    console.log("Hints:", hintsArr);

    let dt = new Date();
    let date = dt.getDate() + '-' + (dt.getMonth() + 1) + '-' + dt.getFullYear();

    let qzid;
    let exists;

    do {
        qzid = generateQuizCode();
        exists = await isQuizIdExists(qzid);
    } while (exists);

    try {
        hideAllQuestions();
        let saving = document.getElementById('saving');
        saving.style.removeProperty('display');

        await setDoc(doc(db, "quizes", qzid), {
            createdBy: localStorage.getItem("userId"),
            quizName: quizName.value,
            mode: seletedMode,
            questions: questionsArr,
            options: optionsObj,
            correctAnswers: correctAnswersArr,
            hints: hintsArr, // ✅ NEW FIELD SAVED
            totalQuestions: questionsArr.length,
            createdAt: date
        });

        let h1 = saving.getElementsByTagName('h1')[0];
        h1.innerHTML = "Your Quiz Saved Successfully !";

        let uButton = document.createElement('a');
        uButton.className = "createBtn";
        uButton.innerHTML = "Dashboard";
        uButton.href = 'myprofile.html';
        saving.appendChild(uButton);

    } catch (error) {
        console.error("Error saving quiz:", error);
    }
}


function generateQuizCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "Q";

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

async function isQuizIdExists(qzid) {
    const quizRef = doc(db, "quizes", qzid);
    const quizSnap = await getDoc(quizRef);

    return quizSnap.exists(); // true or false
}
