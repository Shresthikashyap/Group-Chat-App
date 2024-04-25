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
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);
        const userId = decodedToken.id;

            // group list for members and admin
            const groups = await axios.get(`http://3.27.43.97:3000/group/group-list/${userId}`,{headers:{Authorization:token}}) 
            console.log('Group list ',groups);
            const groupList = document.getElementById('groupList');
            groups.data.list.forEach((group) => {
                    const groupId = group.id;
                    const groupName = group.groupName;
                    const groupDiv = document.createElement('div');
                    groupDiv.textContent = groupName;
                    groupDiv.style.paddingLeft = '38%';
                    groupDiv.style.fontSize = '115%';
                    groupDiv.style.fontFamily = 'Cambria, Cochin, Georgia, Times, Times New Roman, serif';
                    groupDiv.style.fontWeight = "bold";
                                          
                    groupDiv.addEventListener('click', async() => {
                      localStorage.setItem('groupid', groupId);
                      localStorage.setItem('groupName', groupName);

                      const admin = await axios.get(`http://3.27.43.97:3000/admin/checkadmin/${userId}/${groupId}`,{headers:{Authorization:token}})
                      
                      if(admin.data.admin.isAdmin === true) 
                      { localStorage.setItem('link',`http://3.27.43.97:3000/signup.html?groupId=${groupId}`)}
                      else{ localStorage.removeItem('link') }
                    window.location.href = `group-chat.html?groupId=${groupId}`;
                    }); 
                  groupList.appendChild(groupDiv);
            });


    }
    catch(err){
            document.getElementById('error').innerHTML = `Something went wrong`;
    }
});

const signOut = () =>{
    localStorage.removeItem('groupid');
    localStorage.removeItem('groupName');
    localStorage.removeItem('link');
    window.location.href = 'login.html'
}