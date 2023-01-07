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
async function login(){
    let sendButton = document.getElementById("login__submit")
    sendButton.addEventListener("click", async function(e){ 
        e.preventDefault();
        let id = document.getElementsByName("username")[0].value;
        let pwd = document.getElementsByName("password")[0].value;
        console.log(id,pwd);
        let checkLogsBoolean;
        await checkLogs(id,pwd).then(function(res){ 
            if(res.status==200) {
                    checkLogsBoolean= true;
                    console.log(res.status,res.json());
                    a = res.json();
                    
                    }else{console.log(res)}}
        ) .catch(function(err)  {
                    checkLogsBoolean = false;
                    console.log(err);
    });
        if(checkLogsBoolean){
        console.log("ok");

        }else{
            console.log("ntm");
        }
    })
  
}



login();
            
        
 