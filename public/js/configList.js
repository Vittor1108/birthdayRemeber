const li = document.querySelectorAll('.list-birthday-person > li');
const divLi = document.querySelector('.no-birthday-div');
const titleBirthday = document.querySelector(".card-birthday > h2");

if(li.length > 0){
    divLi.style.display = 'none';
}

if(li.length > 1){
    titleBirthday.innerHTML = `${li.length} aniversariantes`;
}else{
    titleBirthday.innerHTML = `${li.length} aniversariante`;   
}