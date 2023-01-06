function login(){
    let id = document.getElementsByName("username").value;
    let pwd = document.getElementsByName("password").value;
    if(checkLogs(id,pwd)){

    }
}

function checkLogs(id,pwd){
    fetch('http://localhost:5678/api/users/login', {
  method: 'POST',
  headers: {
    'Accept': 'application/json', 
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({email:id, password:pwd})
}).then(res => res.json())
  .then(res => console.log(res));
}