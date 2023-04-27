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
            const name = localStorage.getItem("userName");
            const groupName = localStorage.getItem("groupName");            
            if (name) {
              alert(`welcome ${name}`);
              localStorage.removeItem("userName");
        
              const newUser = document.getElementById("newUser");
              newUser.textContent = `${name} joined the ${groupName}`;
            }
           
            if(groupName){
              document.getElementById('group').textContent = groupName;
            }

            const groupLink = localStorage.getItem("link");
            console.log(groupLink)
            if(groupLink){
              const link = document.getElementById('link')
              link.href = groupLink;
              link.textContent = groupLink; // Add link text
            }

            const token = localStorage.getItem('token');
            const decodedToken = await parseJwt(token);
            const userId = decodedToken.id;
            const groups = await axios.get(`http://localhost:3000/group/group-list/${userId}`,{headers:{Authorization:token}}) 
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
                      localStorage.setItem('link',`http://localhost:3000/chat.html/${groupId}`) 
                      window.location.href = `chat.html?groupId=${groupId}`;
                    });
                  
                    groupList.appendChild(groupDiv);
            });

            let lastMsgId = -1;
            const messages = JSON.parse(localStorage.getItem('messages')) || [];
            const groupId = localStorage.getItem('groupid');
            const oldMsgList = document.getElementById('oldMessageList');
            
            for(var i = 0; i < messages.length; i++) {  
              if(messages[i].groupId === groupId){//group id =>  locally stored messages won't load
                 const oldMsg = document.createElement('div');
                 oldMsg.classList.add('message-box');

                 oldMsg.textContent = messages[i].memberName+' - '+ messages[i].message;
             
                 oldMsgList.appendChild(oldMsg);
                 lastMsgId = messages[i].id;
              } 
            }
            //if(lastMsgId > 0){
            setInterval(()=>{
                    const groupId = localStorage.getItem('groupid');
                    getMessages(lastMsgId,groupId);
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

const getMessages = async (lastMsgId,groupId) => {
 
 try {
    console.log(lastMsgId)
    const token = localStorage.getItem("token");

    const response = await axios.get(`http://localhost:3000/message/get-message/${lastMsgId}/${groupId}`,
    { headers: { Authorization: token } });

    
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
 }
};
  
const send = async(event) => {
    try{
         event.preventDefault();
         
         const token = localStorage.getItem('token');
         const decodedToken = await  parseJwt(token); 
         const id = decodedToken.id;
         const name = decodedToken.name;
         const message = event.target.text.value;

         const groupId = localStorage.getItem('groupid');
         console.log(groupId)

         const msgDetails={
            id,name, message
         }
                    
         const response = await axios.post(`http://localhost:3000/message/post-message/${groupId}`,msgDetails,
         {headers:{'Authorization':token}});
         console.log(response);

         let messages = JSON.parse(localStorage.getItem('messages')) || [];
         messages.push(response.data.messageDetails);
         localStorage.setItem('messages', JSON.stringify(messages));
         
         showMessage(response.data.messageDetails);
    }
    catch(err){
            document.getElementById('error').innerHTML = `Something went wrong`;
    }
};

function showMessage(data){
    
    const messageList = document.getElementById('messagelist');
    
    const message = document.createElement('div');
    
    message.classList.add('message-box');
   
    message.innerHTML = data.memberName +' - '+ data.message;
    
   messageList.appendChild(message);

};

