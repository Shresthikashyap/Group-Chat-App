/********************  decode the token  *****************/
function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
      
        return JSON.parse(jsonPayload);
      }

window.addEventListener("DOMContentLoaded",async()=>{
        try{
                alert('welcome');
                const token = localStorage.getItem('token');
                const decodedToken = await  parseJwt(token);  
                const name = decodedToken.name;
                
                const newUser = document.getElementById('newUser');
                newUser.textContent = `${name} joined`;
        }
        catch(error){
                window.location.href = 'signup.html';
        }
})

const send = async(event) => {
        try{
             event.preventDefault();
             
             const token = localStorage.getItem('token');
             const decodedToken = await  parseJwt(token); 
             const id =  decodedToken.id;
             const name = decodedToken.name;
             const message = event.target.text.value;

             const msgDetails={
                id,name, message
             }
             
             console.log(message)

             const response = await axios.post("http://localhost:3000/message/post-message",msgDetails,{headers:{'Authorization':token}});
             console.log(response.data)
             showMessage(response.data.messageDetails);
        }
        catch(err){
                document.getElementById('error').innerHTML = `Something went wrong`;
        }
}

function showMessage(data){

        const messageList = document.getElementById('messagelist');
        const message = document.createElement('message');

        message.textContent = data.memberName+' - '+data.message;
        
        messageList.appendChild(message);
        
}

