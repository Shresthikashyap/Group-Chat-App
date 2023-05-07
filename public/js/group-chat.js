const socket = io();

socket.on('connect', ()=>{
    console.log('Server is Printing it to the client side',socket.id)
    const groupId = localStorage.getItem('groupid');
    socket.emit('joinRoom', groupId)
})

socket.on('receivedMsg',(msg)=>{
  console.log(msg)
  showMessage(msg);
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
            const name = localStorage.getItem("name");
            const groupName = localStorage.getItem("groupName"); 
            const groupid = localStorage.getItem('groupid');           
            if (name) {
              alert(`welcome ${name}`);
              localStorage.removeItem("name");
              
              if(groupName){
              const newUser = document.getElementById("newUser");
              newUser.textContent = `${name} joined the ${groupName}`;
              }
            }
           
            if(groupName){
              const group = document.getElementById('group');
              group.textContent = `${groupName}  `;

              //button for group details
              const infoBtn = document.getElementById('info');
              infoBtn.className = 'btn btn-success btn-sm';
              infoBtn.textContent = 'Details';
  
              infoBtn.addEventListener('click',()=>{
                localStorage.setItem('groupid',groupId);
                //localStorage.setItem('link',`http://localhost:3000/signup.html?groupId=${groupId}`) // group link to share
                window.location.href = `admin.html?groupId=${groupId}`;
              })

              group.appendChild(infoBtn);
            }

            const token = localStorage.getItem('token');
            const decodedToken = await parseJwt(token);
            const userId = decodedToken.id;

            //show link only to the admin
            if(groupid !== null){
              console.log('**************here')
            

            const checkAdmin = await axios.get(`http://localhost:3000/admin/checkadmin/${userId}/${groupid}`,{headers:{Authorization:token}})
            console.log('yes admin ',checkAdmin.data.admin.isAdmin)
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
            // group list for members and admin
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
                                          
                    groupDiv.addEventListener('click', async() => {
                      localStorage.setItem('groupid', groupId);
                      localStorage.setItem('groupName', groupName);
                      const admin = await axios.get(`http://localhost:3000/admin/checkadmin/${userId}/${groupid}`,{headers:{Authorization:token}})
                      if(admin.data.message !== 'false') 
                      { localStorage.setItem('link',`http://localhost:3000/signup.html?groupId=${groupid}`)}
                      else{ localStorage.removeItem('link') }
                      window.location.href = `group-chat.html?groupId=${groupId}`;
                    }); 
                  groupList.appendChild(groupDiv);
            });

            let lastMsgId = -1;
            const messages = JSON.parse(localStorage.getItem('messages')) || [];
            const groupId = localStorage.getItem('groupid');
            const oldMsgList = document.getElementById('oldMessageList');
            
            for(var i = 0; i < messages.length; i++) {  
              if(messages[i].groupId === groupId){  //group id =>  locally stored messages won't load
                 const oldMsg = document.createElement('div');
                 oldMsg.classList.add('message-box');

                 oldMsg.textContent = messages[i].memberName+' - '+ messages[i].message;
             
                 oldMsgList.appendChild(oldMsg);
              lastMsgId = messages[i].id;
              } 
            }  
            // setInterval(()=>{
            //         const groupId = localStorage.getItem('groupid');
                     getMessages(lastMsgId,groupid);
            //         document.getElementById('messagelist').textContent = ' ';
            // },3000);
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
    { headers: { Authorization: token }});
    
    console.log(response.data.message);
    
    if (response.data.message !== 'No messages found') {
      let messages = JSON.parse(localStorage.getItem('messages')) || [];
      
      for (var i = 0; i < response.data.message.length; i++) {
        let newMsg = response.data.message[i];
        messages.push(newMsg);
        showMessage(newMsg);
      }
    }
  }catch(error){
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

         const msgDetails={ id,name, message }
          
         //console.log(msgDetails)
         const response = await axios.post(`http://localhost:3000/message/post-message/${groupId}`,msgDetails,
         {headers:{'Authorization':token}});

         console.log('Before socket',response.data.messageDetails.groupId);
         //const msg = response.data.messageDetails;
            //store the data in local storage     
         console.log('**********',groupId)
        
         socket.emit('message', response.data.messageDetails);
         //socket.emit('joinRoom',groupId);
    }
    catch(err){
            document.getElementById('error').innerHTML = `Something went wrong`;
    }
};


function showMessage(data){
    console.log('Data ',data);
    
    const messageList = document.getElementById('messagelist');
    const message = document.createElement('div'); 
    message.classList.add('message-box');
   
    message.innerHTML = data.memberName +' - '+ data.message;
    
   messageList.appendChild(message);

   let messages = JSON.parse(localStorage.getItem('messages')) || [];
   messages.push(data);
   localStorage.setItem('messages', JSON.stringify(messages));
};


const fileInput = document.getElementById('myfile');
fileInput.addEventListener('input', handleFileSelect = async(event) => {
  try{
      const file = event.target.files[0]; 
      console.log('files**********',file);
      
      const formData = new FormData()
      formData.append('myfile',file);
      console.log('formData',formData.get('myfile'))

      //const File = formData.get('myfile');

      const token = localStorage.getItem('token');

      const groupId = localStorage.getItem('groupid');
      console.log('groupId',groupId)

           const fileStored = await axios.post(`http://localhost:3000/file/filestored/${groupId}`,formData,
           {headers:{'Authorization':token,'Content-Type': 'multipart/form-data'}});

           console.log('duh',fileStored.data.msg.message);  
           document.getElementById('text').value = fileStored.data.msg.message;  

          // socket.emit('joinRoom',groupId);
           socket.emit('message',fileStored.data.msg.message);
               
          }
          catch(err){
            document.getElementById('error').innerHTML = `Something went wrong`;
          }
        }
      )  

      const signOut = () =>{
        localStorage.removeItem('groupid');
        localStorage.removeItem('groupName');
        localStorage.removeItem('link');
        window.location.href = 'login.html'
      }