const inputs = document.querySelectorAll('.code-box');
let actualQuestions;
let gnAnswer;
let gnHints;
let gnQuizName;
let gnQno;
let gnOptions;
let createdBy;
let gnMode;
let answers = [];

let currentQuestion = 0;
let timerInterval = null;
let timeDelay; 

inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        input.value = input.value;
        if (input.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, setDoc, onSnapshot, doc, deleteDoc } 
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


function clicked(event){
    let elems = document.querySelectorAll('.optio');
    elems.forEach((element) => {
        element.style.background = 'lightblue';
        element.style.color = 'black'
    });
    event.target.style.background = 'blue';
    event.target.style.color = 'lightblue';
    answers[currentQuestion] = event.target.id;
}
window.clicked = clicked;

async function search(){
    let searchBtn = document.getElementById('search-btn');
    searchBtn.innerHTML = "Searching..."
    let qcode = '';
    let inps = document.querySelectorAll('.code-box');
    inps.forEach(inp => {
        qcode += inp.value;
    })
    console.log(qcode);
    if(qcode.length != 4){
        alert("Incomplete Quiz Code Given");
        return;
    }
    let quizRef = doc(db,'quizzes',qcode);
    let quizData = await getDoc(quizRef);
    if(!quizData.exists()){
        alert("Quiz Code Not Found !");
        return;
    }
    let qd = quizData.data();
    gnMode = qd.mode;
    createdBy = qd.createdBy;
    if(gnMode === 'Public' || (gnMode == 'Private' && createdBy === localStorage.getItem('userId'))){
        actualQuestions = qd.questions;
        gnAnswer = qd.correctAnswers;
        gnHints = qd.hints;
        gnOptions = qd.options;
        gnQuizName = qd.quizName;
        gnQno = qd.totalQuestions;
        timeDelay = qd.timeDelay;
        for(let i = 0; i < Number(gnQno); i++){
            answers.push(null);
        }
        searchBtn.innerHTML = "Search Quiz";
        showResponse();
    }else if(gnMode === 'Private' && createdBy !== localStorage.getItem('userId')){
        alert("The Given Quiz is Private and Not belog to You !");
    }
}
window.search = search;

function showResponse(){
    let msgs = document.querySelectorAll('.msg');
    msgs.forEach(msg => {
        msg.style.display = 'none';
    })
    let ares = document.querySelectorAll('.ares');
    ares[0].querySelector('span').innerHTML = gnQuizName;
    ares[1].querySelector('span').innerHTML = gnQno;
    ares[2].querySelector('span').innerHTML = gnMode;
    ares.forEach(res => {
        res.style.removeProperty('display');
    })
    document.getElementById('attempt').style.removeProperty('display');
}

function startQuiz() {
    document.querySelector('.top-container').style.display = 'none';
    document.getElementById('Quizzer').style.display = 'block';

    currentQuestion = 0;

    renderQuestion(currentQuestion);
    startTimer(nextQuestion);
}
window.startQuiz = startQuiz;


function nextQuestion() {
    currentQuestion++;

    if (currentQuestion >= gnQno) {
        clearInterval(timerInterval);
        console.log("Quiz finished");
        console.log("User answers:", answers);
        fetchResults();
        return; 
    }

    renderQuestion(currentQuestion);
    startTimer(nextQuestion);
}


function startTimer(onTimeUp) {
    const timerEl = document.getElementById('timer');
    let timeLeft = timeDelay;

    resetTimerStyle(timerEl);
    timerEl.innerText = timeLeft;

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;

        updateTimerStyle(timerEl, timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            onTimeUp();
        }
    }, 1000);
}


function renderQuestion(index) {
    resetOptionsStyle();

    document.getElementById('qno').innerText = index + 1;
    document.getElementById('question').innerText = actualQuestions[index];

    const opts = gnOptions[index + 1];
    document.getElementById('A').innerText = opts[0];
    document.getElementById('B').innerText = opts[1];
    document.getElementById('C').innerText = opts[2];
    document.getElementById('D').innerText = opts[3];

    setupHint(index);

}

function resetOptionsStyle() {
    const opts = document.querySelectorAll('.optio');
    opts.forEach(opt => {
        opt.style.background = 'lightblue';
        opt.style.color = 'black';
    });
}


function updateTimerStyle(timerEl, timeLeft) {
    if (timeLeft <= 5) {
        timerEl.style.background = 'red';
        timerEl.style.color = 'orange';
    } else if (timeLeft <= 10) {
        timerEl.style.background = 'orange';
        timerEl.style.color = 'black';
    }
}


function resetTimerStyle(timerEl) {
    timerEl.style.background = '';
    timerEl.style.color = '';
}

function setupHint(index) {
    const hintEl = document.getElementById('hint');

    hintEl.innerText = "Hint";
    hintEl.style.cursor = "pointer";

    hintEl.onclick = () => {
        hintEl.innerText = gnHints[index] || "No hint available";
        hintEl.style.cursor = "default";
        hintEl.onclick = null; 
    };
}



function fetchResults() {
    let score = 0;
    let ign = 0;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i] === gnAnswer[i]) {
            score++;
        } else if (answers[i] === null) {
            ign++;
        }
    }

    const quizzer = document.getElementById('Quizzer');
    const resulter = document.getElementById('resulter');

    quizzer.style.display = 'none';
    resulter.style.removeProperty('display');

    document.getElementById('correctNo').innerHTML = score;
    document.getElementById('gnQs').innerHTML = gnQno;
    document.getElementById('wrongNo').innerHTML = gnQno - score - ign;
    document.getElementById('ignored').innerHTML = ign;
    document.getElementById('scored').innerHTML = score + '/' + gnQno;
}
window.fetchResults = fetchResults;

function displaySolution() {
    const resulter = document.getElementById('resulter');
    const ansCont = document.getElementById('ansCont');

    resulter.style.display = 'none';
    ansCont.style.removeProperty('display');
    ansCont.innerHTML = "";

    const heading = document.createElement('h1');
    heading.innerText = "Quiz Solutions";
    ansCont.appendChild(heading);

    const indexMap = { A: 0, B: 1, C: 2, D: 3 };

    for (let i = 0; i < gnQno; i++) {

        const QComb = document.createElement('div');
        QComb.id = "QComb";

        const Qnumber = document.createElement('div');
        Qnumber.id = "Qnumber";
        Qnumber.innerText = i + 1;

        const Aquestion = document.createElement('div');
        Aquestion.id = "Aquestion";
        Aquestion.innerText = actualQuestions[i];

        QComb.appendChild(Qnumber);
        QComb.appendChild(Aquestion);
        ansCont.appendChild(QComb);

        const Aanswer = document.createElement('div');
        Aanswer.id = "Aanswer";

        const opts = gnOptions[i + 1];
        const optionDivs = [];

        opts.forEach((text, idx) => {
            const d = document.createElement('div');
            d.className = 'optio';
            d.id = ['A', 'B', 'C', 'D'][idx]; 
            d.innerText = text;
            optionDivs.push(d);
            Aanswer.appendChild(d);
        });

        ansCont.appendChild(Aanswer);

        const correctLetter = gnAnswer[i];   
        const userLetter = answers[i];      

        const correctIndex = indexMap[correctLetter];
        const userIndex = indexMap[userLetter];

        let Result = "";

        // ✅ ALWAYS show correct answer
        if (correctIndex !== undefined) {
            optionDivs[correctIndex].classList.add('correct');
        }

        if (userLetter === null) {
            Result = "Not Attempted";
        }
        else if (userLetter === correctLetter) {
            Result = "Correct";
        }
        else {
            if (userIndex !== undefined) {
                optionDivs[userIndex].classList.add('wrong');
            }
            Result = "Wrong";
        }

        /* ---------- Question number styling ---------- */
        if (Result === 'Not Attempted') {
            Qnumber.style.background = 'aqua';
            Qnumber.style.color = 'black';
        }
        else if (Result === 'Correct') {
            Qnumber.style.background = 'lightgreen';
            Qnumber.style.color = 'darkgreen';
        }
        else {
            Qnumber.style.background = 'orange';
            Qnumber.style.color = 'red';
        }
    }
}

window.displaySolution = displaySolution;
