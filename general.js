let dynBtn = document.getElementById('dynBtn');
if(localStorage.getItem('userId') != null){
    dynBtn.innerHTML = "Dashboard";
    dynBtn.href = 'myprofile.html';
}