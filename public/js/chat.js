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
        try {
                const name = localStorage.getItem("name");
                if (name) {
                  alert(`welcome ${name}`);
                  localStorage.removeItem("name");
            
                  const newUser = document.getElementById("newUser");
                  newUser.textContent = `${name} joined`;
                }

<<<<<<< HEAD
                let lastMsgId = -1;

                const messages = JSON.parse(localStorage.getItem('messages')) || [];

                const oldMsgList = document.getElementById('oldMessageList');
                for(var i = 0; i < messages.length; i++) {  
                    if(messages.groupId === idOfGroup){
                     const oldMsg = document.createElement('div');
                     oldMsg.classList.add('message-box');
    
                     oldMsg.textContent = messages[i].memberName+' - '+ messages[i].message;
                 
                     oldMsgList.appendChild(oldMsg);
                    }
                }

                
                if (messages.length > 0) {
                    lastMsgId = messages[messages.length - 1].id;
                }
                
                setInterval(()=>{
                        getMessages(lastMsgId);
                        document.getElementById('messagelist').textContent = ' ';
                },5000)
        }
        catch(error){
                window.location.href = 'signup.html';
        }
})
=======
                const token = localStorage.getItem('token');
                const decodedToken = await parseJwt(token);
                //const userId = decodedToken.id;
                const groups = await axios.get(`http://localhost:3000/group/group-list`,{headers:{Authorization:token}}) 
                console.log('Group list ',groups);
                const groupList = document.getElementById('groupList');
                groups.data.list.forEach((group) => {
                        const groupId = group.id;
                        const groupName = group.groupName;
                        const groupDiv = document.createElement('div');
                        groupDiv.textContent = groupName;
                        groupDiv.style.paddingLeft = '27%';
                        groupDiv.style.fontWeight = "bold";
                                              
                        groupDiv.addEventListener('click', () => {
                          localStorage.setItem('groupid', groupId);
                          localStorage.setItem('groupName', groupName);
                          localStorage.setItem('userName',decodedToken.name)
                          window.location.href = `group-chat.html?groupId=${groupId}`;
                        });
                      
                        groupList.appendChild(groupDiv);
                });

                let lastMsgId = -1;
                const messages = JSON.parse(localStorage.getItem('messages')) || [];
                const groupId = localStorage.getItem('groupid');
                const oldMsgList = document.getElementById('oldMessageList');
                
                for(var i = 0; i < messages.length; i++) {  
                        if(messages.groupId === 'NULL'){
                                const oldMsg = document.createElement('div');
                                oldMsg.classList.add('message-box');
    
                                oldMsg.textContent = messages[i].memberName+' - '+ messages[i].message;
                 
                                oldMsgList.appendChild(oldMsg);
                                lastMsgId = messages[i].id;
                        }
                }
                //if(lastMsgId > 0){
                setInterval(()=>{
                       
                        getMessages(lastMsgId);
                        document.getElementById('messagelist').textContent = ' ';
                },3000);
                //}
        }
        catch(error){
                console.log(error)
                document.getElementById('newUser').textContent = 'Something Went Wrong';
                //window.location.href = 'signup.html';
        }
});
>>>>>>> 76d2c29 (multiple groups)

const getMessages = async (lastMsgId) => {
     
     try {
        console.log(lastMsgId)
        const token = localStorage.getItem("token");

        const response = await axios.get(`http://localhost:3000/message/get-message/${lastMsgId}`,
        { headers: { Authorization: token } });

        
<<<<<<< HEAD
            console.log(response.data.message);
        
        if(response.data.message !== 'No messages found'){
               for (var i = 0; i < response.data.message.length; i++) {
               showMessage(response.data.message[i]);
              }         
        }
        
        } catch (error) {
         window.location.href = "signup.html";
=======
        console.log(response.data.message);
        
    if (response.data.message !== 'No messages found') {

      let messages = JSON.parse(localStorage.getItem('messages')) || [];

      for (var i = 0; i < response.data.message.length; i++) {
        let newMsg = response.data.message[i];

        // Only add unique messages to the local storage
        if (!messages.some(msg => msg.id === newMsg.id)) {
          messages.push(newMsg);
        }

        showMessage(newMsg);
      }
        
        }
    }    catch (error) {
        console.log(error)
        document.getElementById('newUser').textContent = 'Something Went Wrong';        
>>>>>>> 76d2c29 (multiple groups)
     }
};
      
const send = async(event) => {
        try{
             event.preventDefault();
             
             const token = localStorage.getItem('token');
             const decodedToken = await  parseJwt(token); 
<<<<<<< HEAD
             const id =  decodedToken.id;
=======
             const id = decodedToken.id;
>>>>>>> 76d2c29 (multiple groups)
             const name = decodedToken.name;
             const message = event.target.text.value;

             const msgDetails={
                id,name, message
             }
                        
<<<<<<< HEAD
             const response = await axios.post("http://localhost:3000/message/post-message",msgDetails,
             {headers:{'Authorization':token}});
             console.log(response)
=======
             const response = await axios.post(`http://localhost:3000/message/post-message`,msgDetails,
             {headers:{'Authorization':token}});
             console.log(response);
>>>>>>> 76d2c29 (multiple groups)

             let messages = JSON.parse(localStorage.getItem('messages')) || [];
             messages.push(response.data.messageDetails);
             localStorage.setItem('messages', JSON.stringify(messages));
             
             showMessage(response.data.messageDetails);
        }
        catch(err){
                document.getElementById('error').innerHTML = `Something went wrong`;
        }
<<<<<<< HEAD
}
=======
};
>>>>>>> 76d2c29 (multiple groups)

function showMessage(data){
        
        const messageList = document.getElementById('messagelist');
        
        const message = document.createElement('div');
        
        message.classList.add('message-box');
<<<<<<< HEAD
    
        message.textContent = data.memberName +' - '+ data.message;

       messageList.appendChild(message);   
}
=======
       
        message.innerHTML = data.memberName +' - '+ data.message;
        
       messageList.appendChild(message);

};

>>>>>>> 76d2c29 (multiple groups)
