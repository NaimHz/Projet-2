function setWorks(){
    return fetch("http://localhost:5678/api/works")
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(works) {
        for(let i in works){   
        setOfWorks.push(works[i]);
        }
    })
    .catch(function(err){
        console.log(err);
    })
}
function displayWorks(container,isModal=false){
    container.innerHTML="";
    for(let i in setOfWorks){  
        let url = setOfWorks[i].imageUrl;
        let title = setOfWorks[i].title;
        let workId = setOfWorks[i].id;
        if (isModal){
            let fig = document.createElement('figure');
            if(i==0){
                fig.innerHTML = 
                `<img src="${url}" alt="${title}" class="modal__img" id="modalwork${workId}" crossorigin="anonymous">
                <figcaption>éditer</figcaption>
                <i class="fa-sharp fa-solid fa-up-down-left-right moveicon"></i>
                <i class="fa-sharp fa-solid fa-trash-can trashicon"></i>`;
                container.appendChild(fig);
            }else{  
                fig.innerHTML = 
                `<img src="${url}" alt="${title}" class="modal__img" id="modalwork${workId}" crossorigin="anonymous">
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
        modalId = firstChildId.split('modalwork')[1];
        console.log(modalId);
        deleteWorksOfDOM(modalId);
        });
    }
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
        buttonAll.classList.add("btn");
        buttonAll.classList.add("select");
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
    let buttonSelect = document.getElementById("btn"+category);
    let oldButtonSelect = document.getElementsByClassName("btn");
    for(let element of oldButtonSelect){
        element.classList.remove("select");
    }
    buttonSelect.classList.add("select");
    let works = document.getElementById("works");
    works.innerHTML=" ";

    for(let element of setOfWorks){ 
        if(category==element.categoryId){
            let url = element.imageUrl;
            let title = element.title;
            let fig = document.createElement('figure');
            fig.innerHTML = 
            `<img src="${url}" alt="${title}" crossorigin="anonymous">
            <figcaption>${title}</figcaption>`;
            works.appendChild(fig);
        }
    } 
}
function displayAdmin(){
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
    let saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", saveChanges.bind(saveButton,setOfWorks))
}
function openModal(id,e){
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
        openAddWorks.addEventListener("click",goToModal.bind(openAddWorks,2))
    }
    if(id>1){
        let backButton = document.getElementById("back"+id);
        backButton.addEventListener("click",goToModal.bind(backButton,id-1));
    }
    if(id==2){
        let display = document.getElementById("divuploadimg");
        let upload = document.getElementById("upload");
        let fieldOne = document.getElementsByName("workName")[0];
        let fieldTwo = document.getElementsByName("workCategory")[0];
        let fieldThree = document.getElementById("upload");
        upload.addEventListener("change",loadImg.bind(upload,display));
        fieldOne.addEventListener("change",validationIsValid);
        fieldTwo.addEventListener("change",validationIsValid);
        fieldThree.addEventListener("change",validationIsValid)
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
        openAddWorks.removeEventListener("click",goToModal);
    }
    if(activeModal>1){
        let backButton = document.getElementById("back"+activeModal);
        backButton.removeEventListener("click",goToModal);
    }
    if(activeModal==2){
        if(document.getElementById("workimgupload")!=null){
            document.getElementById("workimgupload").remove(); 
            let divUpload = document.getElementById("divuploadimg");
            divUpload.style.padding = "15px 0px"
        }
        let uploaders = document.querySelectorAll('#divuploadimg *');
        for(let upload of uploaders){
            upload.style.display=""
        }
        
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
                console.log("Work supprimé")
                //let addWorksDiv = document.getElementById("works");
                //displayWorks(addWorksDiv);
            }
            else{
                throw new Error("Le travail n'a pa pu être effacer");
            }
        }) 
        .catch(function(e){
            console.log(e);
        })
}
function deleteWorksOfDOM(id){
    console.log(setOfWorks);
    let workOnGallery = document.getElementById("work"+id);
    let workOnModal = document.getElementById("modalwork"+id);
    workOnGallery.parentNode.style.display= "none";
    workOnModal.parentNode.style.display = "none";
    for(let workid in setOfWorks){
        console.log(workid);
        if(setOfWorks[workid].id==id){
            console.log(workid);
            setOfWorks.splice(workid,1);
        }
    }
    console.log(setOfWorks);
}
function goToModal(id,e){
    console.log(e);
    e.preventDefault();
    closeModal(e);
    openModal(id,e);
}
function loadImg(location,e){
    console.log(e,'coucou');
    imgToUpload = document.getElementById("upload").files[0];
    let reader = new FileReader();
    let uploaders = document.querySelectorAll('#divuploadimg *');
    reader.readAsDataURL(this.files[0]);
    let bool = true;
    reader.addEventListener("load",function(){
        debugger
        if(bool){
            for(let uploader of uploaders){
                uploader.style.display="none";
            }
            location.innerHTML += `<img src=${reader.result} alt='upload image' class="work__imgupload" id="workimgupload" />`
            readerResult = reader.result;
            location.style.padding="0";
            bool = false;
        }
    });
    
}
function validationIsValid(e){
    e.preventDefault();
    let validName = document.getElementsByName("workName")[0].value;
    let validCategory = document.getElementById("workCategory").value;
    let validationbtn = document.getElementById("btnaddworksvalidation");
    let validUpload = document.getElementById("workimgupload");
    if(validUpload!=null){
        if(validName != '' && validCategory != ''){
            validationbtn.classList.add("validationisok")
            validationbtn.addEventListener("click",addNewWorkOnDOM)
        }
        if(validName == ''){
            validationbtn.classList.remove("validationisok");
            validationbtn.removeEventListener("click",addNewWorkOnDOM)
        }
    }
    else{
        validationbtn.classList.remove("validationisok");
    }
}
function addNewWorkOnDOM(e){
    e.preventDefault();
    console.log(imgToUpload);
    let galleryWorks = document.getElementById("works");
    let modalWorks = document.getElementById("modal__works");
    let validName = document.getElementById('workName').value;
    let validCategory = document.getElementById('workCategory').value;
    let validId = (setOfWorks[(setOfWorks.length)-1].id)+1
    validCategory = parseInt(validCategory);
    let newWork = {
        categoryId: validCategory,
        id: validId,
        imageUrl: readerResult,
        title: validName,
        userId: 1
    }
    setOfWorks.push(newWork);
    console.log(setOfWorks);
    let allButtons = document.getElementsByClassName("btn");
    for(let button of allButtons){
        if(button.id=="btn0"){
            button.classList.add("select")
        }
        else{
            button.classList.remove("select");
        }
    }
    displayWorks(galleryWorks);

    displayWorks(modalWorks,true);
}
function addNewWork(name,category){
    console.log(imgToUpload);
    let validName = name;
    let validCategory = category;
    validCategory = parseInt(validCategory);
    let formData = new FormData();
    formData.append('image', imgToUpload);
    formData.append('title', validName);
    formData.append('category', validCategory);
    fetch("http://localhost:5678/api/works", {
          method: "post",
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+ token
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
function saveChanges(set){
    console.log(set,setOfWorks)
    fetch("http://localhost:5678/api/works")
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(works) {
        let workExist;
        for(let i in works){   
            workExist = false;
            workAdded = false;
            for(let j in setOfWorks){
                if((works[i].id)==(setOfWorks[j].id) || workAdded){
                    workExist = true;
                }
            }
            if(workExist==false){
                console.log(works[i].id);
                deleteWorks(works[i].id);
            }
        }
        for(let k in setOfWorks){
            if((setOfWorks[k].id)>(works[(works.length)-1].id)){
                addNewWork(setOfWorks[k].title,setOfWorks[k].categoryId)
            }    
        }
        console.log(works)
    })
    .catch(function(err){
        console.log(err);
    })
}

let token = sessionStorage.getItem('key');
let setOfWorksSet = new Set();
let setOfWorks = Array.from(setOfWorksSet);

setWorks().then(function(ok){
    let works = document.getElementById("works");
    let modalWorks = document.getElementById("modal__works");
    console.log(ok);
    displayFilters();
    displayWorks(works)
    displayWorks(modalWorks,true);
    let activeModal = 0;
    let imgToUpload;
    let readerResult;
    if (token !== undefined && token !== null){
        displayAdmin(token);
    }
})












