
function displayWorks(){
    fetch("http://localhost:5678/api/works")
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(value) {
        let works = document.getElementById("works");
        works.innerHTML=" ";
        for(let i of value){    
            let url = i.imageUrl;
            let title = i.title;
            let fig = document.createElement('figure');
            fig.innerHTML = 
            `<img src="${url}" alt="${title}" crossorigin="anonymous">
		    <figcaption>${title}</figcaption>`;
            works.appendChild(fig);
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
            for(let element of oldButtonSelect){
            element.classList.remove("select");
            }
            buttonAll.classList.add("select");
            displayWorks();
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
    if (token !== undefined && token !== null){
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
    }
}
function openModal(e){
    e.preventDefault();
    let modal = document.getElementById("modal1");
    modal.setAttribute("style","display:flex;");
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal",'true')
    console.log(modal);
    

}

displayWorks();

displayFilters();

let token = sessionStorage.getItem('key');
displayAdmin(token);

let buttons = document.getElementsByClassName("button__editor");
for(let button of buttons){
    button.addEventListener('click',openModal);
}






