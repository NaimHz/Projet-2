function displayWorks(container,isModal=false){
    fetch("http://localhost:5678/api/works")
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(works) {
        container.innerHTML="";
        for(let i in works){   
            let url = works[i].imageUrl;
            let title = works[i].title;
            workId = works[i].id;
            if (isModal){
                let fig = document.createElement('figure');
                if(i==0){
                    fig.innerHTML = 
                    `<img src="${url}" alt="${title}" class="modal__img" id="modal${workId}" crossorigin="anonymous">
                    <figcaption>éditer</figcaption>
                    <i class="fa-sharp fa-solid fa-up-down-left-right moveicon"></i>
                    <i class="fa-sharp fa-solid fa-trash-can trashicon"></i>`;
                    container.appendChild(fig);
                }else{  
                    fig.innerHTML = 
                    `<img src="${url}" alt="${title}" class="modal__img" id="modal${workId}" crossorigin="anonymous">
                    <figcaption>éditer</figcaption>
                    <i class="fa-sharp fa-solid fa-trash-can trashicon"></i>`;
                    container.appendChild(fig);
                }

            }else{ 
                let fig = document.createElement('figure');
                fig.innerHTML = 
                `<img src="${url}" alt="${title}" id="work${workId}" crossorigin="anonymous">
                <figcaption>${title}</figcaption>`;
                container.appendChild(fig);
            }
        }
        let supprButtons = document.getElementsByClassName("trashicon");
        let parent;
        let firstChild;
        let firstChildId;
        let modalId;
        for(let supprButton of supprButtons){
            supprButton.addEventListener("click", function (e){
            e.preventDefault();
            parent = supprButton.parentNode;
            firstchild = parent.firstChild;
            firstChildId = firstchild.id;
            modalId = firstChildId.split('modal')[1];
            console.log(modalId);
            deleteWorks(modalId);
            });
        }
    })
    .catch(function(err) {
        console.log(err);
    });
    
}
function displayFilters(){
    fetch("http://localhost:5678/api/categories")
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(value) {
        let buttonsDiv = document.getElementById("buttons");
        let buttonAll = document.createElement("button");
        buttonAll.textContent = 'Tous';
        buttonAll.classList.add("btn", "select");
        buttonAll.setAttribute("id","btn0");
        buttonsDiv.appendChild(buttonAll);
        buttonAll.addEventListener('click', function(){
            let oldButtonSelect = document.getElementsByClassName("btn");
            let workGalery = document.getElementById("works");
            for(let element of oldButtonSelect){
            element.classList.remove("select");
            }
            buttonAll.classList.add("select");
            displayWorks(workGalery);
        })
        for(let i of value){  
            let buttonFilter = document.createElement("button");
            buttonFilter.classList.add("btn");
            buttonFilter.setAttribute("id","btn"+i.id);
            buttonFilter.textContent = i.name;
            buttonsDiv.appendChild(buttonFilter);
            buttonFilter.addEventListener('click', function() {displayFilteredWorks(i.id)});
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}
function displayFilteredWorks(category){
     fetch("http://localhost:5678/api/works")
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(value) {
        let buttonSelect = document.getElementById("btn"+category);
        let oldButtonSelect = document.getElementsByClassName("btn");
        for(let element of oldButtonSelect){
            element.classList.remove("select");
        }
        buttonSelect.classList.add("select");
        let works = document.getElementById("works");
        works.innerHTML=" ";
        
        for(let element of value){ 
            if(category==element.category.id){
                let url = element.imageUrl;
                let title = element.title;
                let fig = document.createElement('figure');
                fig.innerHTML = 
                `<img src="${url}" alt="${title}" crossorigin="anonymous">
                <figcaption>${title}</figcaption>`;
                works.appendChild(fig);
            }
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}
function displayAdmin(token){

    console.log(token);
    
        let buttons = document.getElementsByClassName("button__editor");
        let head = document.getElementById("admin__edit");
        let loginbutton = document.getElementById("login__button");
        loginbutton.setAttribute("href","#");
        loginbutton.innerHTML = "logout";
        loginbutton.addEventListener('click',function (){
            sessionStorage.removeItem('key');
            window.location.reload();
        })
        head.style.display="flex";
        for(let button of buttons){
            button.style.display="inline";
        }
        let openModalButtons = document.getElementsByClassName("button__editor");
        for(let openModalButton of openModalButtons){
            openModalButton.addEventListener('click',openModal.bind(openModalButton,1));
        }
}
function openModal(id,e){
    console.log(id,e);
    e.preventDefault();
    activeModal = id;
    let modal = document.getElementById("modal"+id);
    let modalContainer = document.querySelector("#modal"+id+" .modal")
    let closeButton = document.getElementById("close"+id);
    modal.style.display='flex';
    closeButton.addEventListener('click',closeModal);
    modal.addEventListener('click',closeModal);
    modalContainer.addEventListener('click',stopPropagation);
    if(id==1){
        let openAddWorks = document.getElementById("btnaddworks");
        let modalWorks = document.getElementById("modal__works");
        displayWorks(modalWorks,true);
        openAddWorks.addEventListener("click",goToModal.bind(openAddWorks,2))
    }
    if(id>1){
        let backButton = document.getElementById("back"+id);
        backButton.addEventListener("click",goToModal.bind(backButton,id-1));
    }
    if(id==2){
        if(document.querySelector(".work__imgupload")==null){
            let display = document.getElementById("divuploadimg");
            let upload = document.getElementById("upload");
            upload.addEventListener("change",loadImg.bind(upload,display));
            let fieldOne = document.getElementsByName("workName")[0];
            let fieldTwo = document.getElementsByName("workCategory")[0];
            fieldOne.addEventListener("change",validationIsValid);
            fieldTwo.addEventListener("change",validationIsValid);
        }
    }
}
function closeModal(e){
    let closeButton = document.getElementById("close"+activeModal);
    let modal = document.getElementById('modal'+activeModal);
    let modalContainer = document.querySelector("#modal"+activeModal+" .modal")
    modal.style.display='none';
    closeButton.removeEventListener('click',closeModal);
    modal.removeEventListener('click',closeModal);
    modalContainer.removeEventListener("click",stopPropagation);
    if(activeModal==1){
        let openAddWorks = document.getElementById("btnaddworks");
        let modalWorks = document.getElementById("modal__works");
        openAddWorks.removeEventListener("click",goToModal);
        modalWorks.innerHTML="";
    }
    if(activeModal>1){
        let backButton = document.getElementById("back"+activeModal);
        backButton.removeEventListener("click",goToModal);
    }
    if(activeModal==2){

    }
    activeModal = 0;
}
function stopPropagation(e){
    e.stopPropagation();
}
function deleteWorks(id){
    fetch('http://localhost:5678/api/works/' + id, {
        method: 'DELETE',
        headers: {Authorization: 'Bearer ' + token}
    })
        .then(function(res){
            if(res.ok){
                let addWorksDiv = document.getElementById("works");
                closeModal();
                displayWorks(addWorksDiv);
            }
            else{
                throw new Error("Le travail n'a pa pu être effacer");
            }
        }) 
        .catch(function(e){
            console.log(e);
        })
}
function goToModal(id,e){
    console.log(e);
    e.preventDefault();
    closeModal(e);
    openModal(id,e);
}
function loadImg(location,e){
    e.preventDefault();
    imgToUpload = document.getElementById("upload").files[0];
    let reader = new FileReader();
    let uploaders = document.querySelectorAll('#divuploadimg *');
    reader.readAsDataURL(this.files[0]);
    console.log(reader.result);
    reader.addEventListener("load",function(){
        for(let uploader of uploaders){
            uploader.style.display="none";
        }
        location.innerHTML += `<img src=${reader.result} alt='' class="work__imgupload"/>`
    });
    location.style.padding="0";
}
function validationIsValid(e){
    e.preventDefault();
    let validName = document.getElementsByName("workName")[0].value;
    let validCategory = document.getElementsByName("workCategory")[0].value;
    let validationbtn = document.getElementById("btnaddworksvalidation");
    // if(document.getElementById("upload")==null){
        //if(validName != '' && validCategory != ''){
            validationbtn.classList.add("validationisok")
            validationbtn.addEventListener("click",addNewWork)
        //}
        //if(validName == '' || validCategory == ''){
            //validationbtn.classList.remove("validationisok");
        //}
    //}
    //else{
        //validationbtn.classList.remove("validationisok");
    //}
}
function addNewWork(e){
    e.preventDefault();
    console.log(imgToUpload);
    let validName = document.getElementById('workName').value;
    let validCategory = document.getElementById('workCategory').value;
    validCategory = parseInt(validCategory);
    let formData = new FormData();
    formData.append('image', imgToUpload);
    formData.append('title', validName);
    formData.append('category', validCategory);
    fetch("http://localhost:5678/api/works", {
          method: "post",
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+ token, 
            
          },
          body:formData
        })
        .then(function(res) {
          if (res.ok) {
            let addWorksDiv = document.getElementById("works");
            closeModal();
            displayWorks(addWorksDiv);
          }
        }).catch(function(err){
            console.log(err);
    })
}

let works = document.getElementById("works");
displayWorks(works);

displayFilters();

let token = sessionStorage.getItem('key');
let activeModal = 0;
let imgToUpload;
if (token !== undefined && token !== null){
    displayAdmin(token);
}








