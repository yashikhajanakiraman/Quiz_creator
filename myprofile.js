if(localStorage.getItem('userId') === null){
    alert("Please Login !");
    window.location.href = "login-page.html";
}
function logOut(){
    localStorage.clear();
    window.location.href = 'index.html';
}
window.logOut = logOut;