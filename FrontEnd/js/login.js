function login(){
    let sendButton = document.getElementById("login__submit")
    sendButton.addEventListener("click", function(e){ 
        e.preventDefault();
        let id = document.getElementsByName("username").value;
        let pwd = document.getElementsByName("password").value;
        if(checkLogs(id,pwd)){
        console.log("ok");

        }else{
            console.log("ntm");
        }
    })
  
}

function checkLogs(a,b){
    fetch('http://localhost:5678/api/users/login', {
  method: 'POST',
  headers: {
    'Accept': 'application/json', 
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({email: a, password:b})
}).then(function(res){ 
        if(res.ok) {
                return(true); 
                }else{
                    throw new error();
                }}
) .catch(function(err)  {console.log(err)
                return (false);
});
}

login();
            
        
 