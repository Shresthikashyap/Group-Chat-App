const socket = io(); // Initialize a WebSocket connection

// Listen for a 'connect' event when the WebSocket connection is established
socket.on('connect', ()=>{
    console.log('Server is Printing it to the client side',socket.id)
    const groupId = localStorage.getItem('groupid');     // 'groupid' value from client's localStorage
    socket.emit('joinRoom', groupId);      // Emit a 'joinRoom' event to the server, passing the 'groupId'
})

// Listen for a 'receivedMsg' event from the server
socket.on('receivedMsg',(msg)=>{
  console.log('msg ',msg)
  showMessage(msg);    // Call a function to display the received message in the client's interface
 }) ;


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
            //const name = localStorage.getItem("name");
            const groupName = localStorage.getItem("groupName"); 
            const groupid = localStorage.getItem('groupid');           
           
            if(groupName){
              const group = document.getElementById('group');
              group.textContent = `${groupName}  `;

              //button for group details
              const infoBtn = document.getElementById('info');

              infoBtn.className = 'btn btn-success btn-sm';
              infoBtn.textContent = 'Details';
  
              infoBtn.addEventListener('click',()=>{
                localStorage.setItem('groupid',groupId);
                window.location.href = `group-details.html?groupId=${groupId}`;
              })
            
              group.appendChild(infoBtn);
            }

            const token = localStorage.getItem('token');
            const decodedToken = await parseJwt(token);
            const userId = decodedToken.id;

            //show link only to the admin
            if(groupid !== null){
              console.log('**************here')
            
            const checkAdmin = await axios.get(`https://group-chat-app-ucz4.onrender.com/admin/checkadmin/${userId}/${groupid}`,{headers:{Authorization:token}})

            if(checkAdmin.data.admin.isAdmin === true){ 
            const groupLink = localStorage.getItem("link");
            console.log(groupLink)
              if(groupLink){
                const link = document.getElementById('link')
                link.href = groupLink;
                link.textContent = groupLink; // Add link text
              }
            }
            else{
                localStorage.removeItem('link');
            }
          }

            // load old messages from local storage
            let lastMsgId = 0;
            const messages = JSON.parse(localStorage.getItem('messages')) || []; 
            const groupId = localStorage.getItem('groupid');
            const oldMsgList = document.getElementById('oldMessageList');
            
            for(var i = 0; i < messages.length; i++) { 
              if(messages[i].groupId == groupId){  //msg that has current group id
                 const oldMsg = document.createElement('div');
                 oldMsg.classList.add('message-box');

                 if(userId == messages[i].userId){
                    oldMsg.textContent = 'You - '+ messages[i].message;
                 }else{
                    oldMsg.textContent = messages[i].memberName +' - '+ messages[i].message;
                 }
             
                 oldMsgList.appendChild(oldMsg);
                 lastMsgId = messages[i].id;    
              } 
            }
            
            //get last msg id from the locally stored messages
            console.log('last message id ',lastMsgId);
            if(lastMsgId>0){ 
              getMessages(lastMsgId,groupid); 
            }
             
    }
    catch(error){
            console.log(error);
            //document.getElementById('info').textContent = 'Something Went Wrong';
            //window.location.href = 'signup.html';
    }
});

// s
const getMessages = async (lastMsgId,groupId) => {
 try {
    console.log(lastMsgId);
    const token = localStorage.getItem("token");

    const response = await axios.get(`https://group-chat-app-ucz4.onrender.com/message/get-message/${lastMsgId}/${groupId}`,
    { headers: { Authorization: token }});
        
    console.log('get meassage ',response)
    if (response.data.message !== 'No messages found') {      
      for (var i = 0; i < response.data.message.length; i++) {
        let newMsg = response.data.message[i];
        console.log('new msg ',newMsg);
        showMessage(newMsg);
      }
    }
  }catch(error){
    console.log('error ',error);
    document.getElementById('info').textContent = 'Something Went Wrong';        
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

         const msgDetails={ id,name, message }
          
         const response = await axios.post(`https://group-chat-app-ucz4.onrender.com/message/post-message/${groupId}`,msgDetails,
         {headers:{'Authorization':token}});

         console.log('Before socket',response.data.messageDetails.groupId);
         
            //store the data in local storage     
         socket.emit('message', response.data.messageDetails);
    }
    catch(err){
        console.log('error ',error);
        //document.getElementById('error').innerHTML = `Something went wrong`;
    }
};

// show new messages
async function showMessage(data){
  try{
    console.log('Data ',data);
    const token = localStorage.getItem("token");
    const decodedToken = await parseJwt(token);
    const userId = decodedToken.id;

    const messageList = document.getElementById('messagelist');
    const message = document.createElement('div'); 
    message.classList.add('message-box');
    if(userId == data.userId){
          message.innerHTML = 'You - ' + data.message;
    }else{
          message.innerHTML = data.memberName +' - '+ data.message;
    }
    
    messageList.appendChild(message);

    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    // Check if the message already exists in local storage
    const existingMessage = messages.find((m) => m.id === data.id);

    if (!existingMessage) {
      messages.push(data);
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }
  catch(err){
      console.log('error ',error);
    //document.getElementById('error').innerHTML = `Something went wrong`;
  }
};


const fileInput = document.getElementById('myfile');
fileInput.addEventListener('input', handleSelectedFile = async(event) => {
  try{
      const file = event.target.files[0]; 
      console.log('files**********',file);
      
      const formData = new FormData()
      formData.append('myfile',file);

      console.log('formData',formData.get('myfile'))

      const groupId = localStorage.getItem('groupid');
      console.log('groupId',groupId)

      const token = localStorage.getItem('token');
      const fileStored = await axios.post(`https://group-chat-app-ucz4.onrender.com/file/filestored/${groupId}`,formData,
           {headers:{'Authorization':token,'Content-Type': 'multipart/form-data'}});

      console.log('file name',fileStored.data.fileName);
      console.log('duh',fileStored.data.msg.message); 

      document.getElementById('text').value = fileStored.data.msg.message;  

      socket.emit('message',fileStored.data.msg.message);             
    }
  catch(err){
      console.log('error ',error);
           // document.getElementById('error').innerHTML = `Something went wrong`;
    }
  }
)  

const signOut = () =>{
  localStorage.removeItem('groupid');
  localStorage.removeItem('groupName');
  localStorage.removeItem('link');
  window.location.href = 'login.html'
}

const checkGroupList = () =>{
  localStorage.removeItem('groupid');
  localStorage.removeItem('groupName');
  localStorage.removeItem('link');
  window.location.href = 'group-list.html'
}
