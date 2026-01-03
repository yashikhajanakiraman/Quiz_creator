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

let d = doc(db,'quizzes','Q111');
let d1 = doc(db,'quizzes','Q112');
await setDoc(d,{
  createdBy: "u3053",
  quizName: "JavaScript Core Concepts",
  mode: "Public",
  totalQuestions: 5,
  timeDelay: 15,

  questions: [
    "Which keyword is used to declare a constant in JavaScript?",
    "What is the output of typeof null?",
    "Which method converts a JSON string into an object?",
    "Which operator checks both value and type?",
    "Which function is used to delay execution in JavaScript?"
  ],

  options: {
    1: ["var", "let", "const", "static"],
    2: ["null", "object", "undefined", "number"],
    3: ["JSON.stringify()", "JSON.parse()", "parseJSON()", "toObject()"],
    4: ["==", "=", "===", "!="],
    5: ["setTimeout()", "delay()", "wait()", "sleep()"]
  },

  correctAnswers: ["C", "B", "B", "C", "A"],

  hints: [
    "Its value cannot be reassigned",
    "This is a famous JavaScript bug",
    "Used when receiving data from APIs",
    "Also called strict equality",
    "Executes a function after some time"
  ]
});

await setDoc(d1,{
  createdBy: "u3053",
  quizName: "Computer Science Fundamentals",
  mode: "Private",
  totalQuestions: 6,
  timeDelay: 20,

  questions: [
    "What does CPU stand for?",
    "Which data structure follows FIFO?",
    "Which language is closest to hardware?",
    "What is the time complexity of binary search?",
    "Which memory is volatile?",
    "Which device is used to input text into a computer?"
  ],

  options: {
    1: ["Central Processing Unit", "Computer Power Unit", "Core Processing Utility", "Central Program Unit"],
    2: ["Stack", "Tree", "Queue", "Graph"],
    3: ["Python", "C", "JavaScript", "HTML"],
    4: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    5: ["ROM", "SSD", "RAM", "Hard Disk"],
    6: ["Mouse", "Monitor", "Keyboard", "Printer"]
  },

  correctAnswers: ["A", "C", "B", "B", "C", "C"],

  hints: [
    "Known as the brain of the computer",
    "First In First Out principle",
    "Used for system-level programming",
    "Divide-and-conquer algorithm",
    "Data is lost when power is off",
    "Common typing device"
  ]
});