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
            const groupName = localStorage.getItem("groupName");
            const groupId = localStorage.getItem('groupId') 
            console.log(groupName)
            if(groupName){
              const group = document.getElementById('group');
              group.textContent = `${groupName}  `;
            }

            const groupLink = localStorage.getItem("link");
            console.log(groupLink)
            if(groupLink){
              const link = document.getElementById('link')
              link.href = groupLink;
              link.textContent = groupLink; // Add link text
            }
               
            const token = localStorage.getItem('token');
            const decodedToken = await parseJwt(token); console.log('decoded token ',decodedToken)
            const userId = decodedToken.id;

            console.log('user id',decodedToken.id)
            const groups = await axios.get(`http://localhost:3000/group/group-list/${userId}`,{headers:{Authorization:token}}) 
            console.log('Group list ',groups);
            const groupList = document.getElementById('groupList');
            groups.data.list.forEach((group) => {
                    const groupid = group.id;
                    const groupName = group.groupName;
                    const groupDiv = document.createElement('div');
                    groupDiv.textContent = groupName;
                    groupDiv.style.paddingLeft = '27%';
                    groupDiv.style.fontWeight = "bold";
                                          
                    groupDiv.addEventListener('click', () => {
                      localStorage.setItem('groupid', groupid);
                      localStorage.setItem('groupName', groupName);
                      window.location.href = `group-chat.html?groupId=${groupid}`;
                    });
                  
                  groupList.appendChild(groupDiv);
            });
             

            // Main thing starts from here
            const admin = await axios.get(`http://localhost:3000/admin/checkadmin/${userId}/${groupId}`,{headers:{Authorization:token}})
            console.log(admin.data)  //check admin
            console.log('user id ',userId)
           
                    const memberList = await axios.get(`http://localhost:3000/admin/memberlist/${groupId}`,{
                        headers:{Authorization:token}
                    })
                    console.log('memberlist',memberList);  
        
                    // Members of the group
                    const members = document.getElementById('memberlist');
                    memberList.data.list.forEach((member) => {
                        const user = document.createElement('div');
                        user.textContent = `${member.name} - ${member.email} - ${member.phone_number} `;
                        user.style.fontWeight = "bold";
                        
                        if(admin.data.message !== 'false'){ // *************  only for admins  ***********
                          
                          const memberId = member.id;
                          if(memberId !== userId){
                             const removeBtn = document.createElement('button');
                             removeBtn.className = 'btn btn-danger btn-sm';
                             removeBtn.textContent = 'Remove';
                             removeBtn.addEventListener('click',async()=>{
                             await removeMember(memberId,groupId);
                             })
        
                            const makeAdmin = document.createElement('button');
                            makeAdmin.className = 'btn btn-success btn-sm';
                            makeAdmin.textContent = 'Make Admin';
                            makeAdmin.addEventListener('click', async()=>{
                            console.log(memberId,groupId);
                            await changeAdmin(memberId,groupId); 
                            })

                            user.append(removeBtn);
                            user.append(makeAdmin); 
                          }   
                      }
                        members.appendChild(user);
                    })
                
        }
        catch(err){
            document.getElementById('failure').textContent = 'Something went wrong';
        }
    });

    const removeMember = async(userId,groupId) =>{
        try{
            console.log(userId,groupId)
            const token = localStorage.getItem('token'); 
            const removedUser = await axios.get(`http://localhost:3000/admin/removeuser/${userId}/${groupId}`,
            {headers:{Authorization:token}});
        
            console.log(removedUser);
             alert(' Removed Successfully');
             window.location.href = `admin.html?groupId=${groupId}`;
        }
        catch(error){
            document.getElementById('failure').textContent = 'Something went wrong';
        }
    }

    const changeAdmin = async(memberId, _groupId) => {
        try{
          console.log(memberId,_groupId)
          const token = localStorage.getItem('token')
          const adminDetails = await axios.get(`http://localhost:3000/admin/changeadmin/${memberId}/${_groupId}`,
          {headers:{Authorization:token}});

          console.log(adminDetails.data);
          alert('You are no longer an admin of this Group');
          const groupId = localStorage.getItem('groupId');
          window.location.href = `admin.html?groupId=${_groupId}`;
        }
        catch(error){
            document.getElementById('failure').textContent = 'Something went wrong';
        }
    }