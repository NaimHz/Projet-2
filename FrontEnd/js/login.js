async function checkLogs(a,b){
   return fetch('http://localhost:5678/api/users/login', {
  method: 'POST',
  headers: {
    'Accept': 'application/json', 
    'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify({email:a,password:b})
}) 
}
function login(){
    let sendButton = document.getElementById("login__submit")
    sendButton.addEventListener("click", async function(e){ 
        e.preventDefault();
        let id = document.getElementsByName("username")[0].value;
        let pwd = document.getElementsByName("password")[0].value;
        let resStat;
        let resToken;
        let resMessage;
        await checkLogs(id,pwd).then(async function(res){ 
            resStat = res.status;
            if(resStat==200 || resStat==404) {
                    return (res.json());
                    }else{
                    throw new Error("Wrong password");
             }
            })  .then(function(res){
                    if(resStat==200){
                        resToken = res.token;
                        console.log(resToken);
                        sessionStorage.setItem('key', resToken);
                        window.location.href="index.html";
                    }
                    else{
                        document.getElementById("logincomment").innerHTML = 'Mauvais identifiant'
                    }
            }) .catch(function(err)  {
                    console.log(err);
                    document.getElementById("logincomment").innerHTML = 'Erreur de mot de passe'
            }) 
    })
  
}



login();
            
        
 