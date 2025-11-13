const fullName = document.getElementById('fullName');
const userEmail = document.getElementById('userEmail');
const dynButton = document.getElementById('dynButton');
const nxtButton = document.getElementById('nxtButton');
const pass1 = document.getElementById('pass1');
const pass2 = document.getElementById('pass2');
const texter = document.querySelector('.texter');
const sts = texter.querySelector('.status');
const msg = texter.querySelector('.msg');
const inputGetter = document.getElementById('inputGetter');
const passwordSetter = document.getElementById('passwordSetter');
const form = document.querySelector('form');
const numFld = document.getElementById('mobileNumb');
const addBtn = document.getElementById('addButton');
const conformator = document.getElementById('conformator');
const numberGetter = document.getElementById('numberGetter');
let completed = 0;
function updateButtonBackground() {
    completed = 0;
    if (fullName.value.trim() !== "") completed += 1;
    if (userEmail.value.trim() !== "") completed += 1;

    const percent = (completed / 2) * 100;
    if(completed === 2){
        dynButton.style.cursor = 'pointer';
    }else{
        dynButton.style.removeProperty('cursor');
    }
    dynButton.style.setProperty('--fill-width', `${percent}%`);
}

fullName.addEventListener('blur', updateButtonBackground);
userEmail.addEventListener('blur', updateButtonBackground);

fullName.addEventListener('input', updateButtonBackground);
userEmail.addEventListener('input', updateButtonBackground);

function containsNumber(str){
    for(let char of str){
        if(!isNaN(char) && char !== ' '){
            return true;
        }
    }
    return false;
}

function containsSpecialCharacter(str) {
    const regex = /[^a-zA-Z0-9]/;
    return regex.test(str);
}
function updatePass(){
    nxtButton.style.display = 'none';
    if(pass1.value.length < 6){
        sts.innerHTML = "Very Weak:";
        msg.innerHTML = "At least 6 Characters";
        sts.style.color = 'red';
    }else if(!containsNumber(pass1.value)){
        sts.innerHTML = "Weak:";
        msg.innerHTML = "No numbers detected";
        sts.style.color = 'orange';
    }else if(!containsSpecialCharacter(pass1.value)){
        sts.innerHTML = "Not Strong:";
        msg.innerHTML = "No Sepcial Characters detected";
        sts.style.color = 'orange';
    }else{
        if(pass2.value.trim() === ''){
            sts.innerHTML = "Strong:";
            msg.innerHTML = "Your Password is Strong Enough !";
            sts.style.color = 'green';
        }else{
            if(pass1.value.trim() !== pass2.value.trim()){
                sts.innerHTML = "Not Matched:";
                msg.innerHTML = "Matching Failed !";
                sts.style.color = 'red';
            }else{
                sts.innerHTML = "Matched:";
                msg.innerHTML = "Matching Successed !!";
                sts.style.color = 'green';
                nxtButton.style.display = 'block';
            }
        }
    }
}

function updateNumber() {
    const percent = (numFld.value.length / 10) * 100;
    console.log(numFld.value.length)
    if(numFld.value.length === 10){
        addBtn.style.cursor = 'pointer';
    }else{
        addBtn.style.removeProperty('cursor');
    }
    if(numFld.value.length > 10){
        console.log('h3')
        document.querySelector('.dyn-btn button::before').style.background = 'red';
    }
    addBtn.style.setProperty('--fill-width', `${percent}%`);
    if(isNaN(Number(numFld.value))){
        addBtn.style.setProperty('--fill-width', `0%`);
        addBtn.style.background = 'red';
    }else{
        addBtn.style.background = 'linear-gradient(to bottom right, orange,wheat)';
    }
}
numFld.addEventListener('input', updateNumber);
numFld.addEventListener('blur', updateNumber);
function proceedNow(){
    if(completed == 2){
        inputGetter.style.display = 'none';
        passwordSetter.style.display = 'flex';
    }
}
pass1.addEventListener('input',updatePass);
pass2.addEventListener('input',updatePass);
pass1.addEventListener('blur',updatePass);
pass2.addEventListener('blur',updatePass);

form.addEventListener('submit', function(event){
    event.preventDefault();
});

function completed(act){
    if(act){
        conformator.style.display = 'flex';
        numberGetter.style.display = 'none';
    }
}