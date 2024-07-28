
/********************  decode the token  *****************/
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
}

const newGroup = async(event) =>{
    try{
        event.preventDefault();

        const adminName = event.target.adminName.value;
        const groupName = event.target.groupName.value;

        const newGroupDetails ={
            adminName,groupName
        }
        
        const token = localStorage.getItem('token');
        const decodedToken = await parseJwt(token);
        const userId = decodedToken.id

<<<<<<< HEAD
        const response = await axios.post(`http://localhost:3000/group/new-group/${userId}`,newGroupDetails,{
=======
        const response = await axios.post(`https://group-chat-app-ucz4.onrender.com/group/new-group/${userId}`,newGroupDetails,{
>>>>>>> ed09ce2563c3d70f0434b1f42d43f89b8a760c89
            headers:{'Authorization':token}
        });

        console.log('new group',response);
        localStorage.setItem('groupid',response.data.newGroupDetails.id);
        localStorage.setItem('groupName',response.data.newGroupDetails.groupName);
        const groupId = response.data.newGroupDetails.id;
<<<<<<< HEAD
        localStorage.setItem('link',`http://localhost:3000/signup.html?groupId=${groupId}`) // group link to share 
=======
        localStorage.setItem('link',`https://group-chat-app-ucz4.onrender.com/signup.html?groupId=${groupId}`) // group link to share 
>>>>>>> ed09ce2563c3d70f0434b1f42d43f89b8a760c89
        window.location.href = `group-chat.html?groupId=${groupId}`;
    }
    catch(error){
        console.log(error)
        //document.getElementById('failure').innerHTML = 'Something went Wrong';
    }
}
