// get the api url
async function getApiUrl() {
    const response = await fetch('/api/config');
    const data = await response.json();
    return data.apiUrl;
};


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
        const userId = decodedToken.id;
        let apiUrl = await getApiUrl();

        const response = await axios.post(`${apiUrl}/group/new-group/${userId}`,newGroupDetails,{
            headers:{'Authorization':token}
        });

        console.log('new group',response);
        localStorage.setItem('groupid',response.data.newGroupDetails.id);
        localStorage.setItem('groupName',response.data.newGroupDetails.groupName);
        const groupId = response.data.newGroupDetails.id;

        localStorage.setItem('link',`${apiUrl}/signup.html?groupId=${groupId}`) // group link to share 
        window.location.href = `group-chat.html?groupId=${groupId}`;
    }
    catch(error){
        console.log(error)
        //document.getElementById('failure').innerHTML = 'Something went Wrong';
    }
}
