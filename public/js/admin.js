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
            const groupId = localStorage.getItem('groupid') 
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
                                          
                    groupDiv.addEventListener('click', async() => {
                      localStorage.setItem('groupid', groupid);
                      localStorage.setItem('groupName', groupName);
                      const admin = await axios.get(`http://localhost:3000/admin/checkadmin/${userId}/${groupid}`,{headers:{Authorization:token}})
                      if(admin.data.message !== 'false') { localStorage.setItem('link',`http://localhost:3000/signup.html?groupId=${groupid}`)}
                      else{ localStorage.removeItem('link') }
                      window.location.href = `group-chat.html?groupId=${groupid}`;
                    });
                  
                  groupList.appendChild(groupDiv);
            });
             

            // Main thing starts from here
            const admin = await axios.get(`http://localhost:3000/admin/checkadmin/${userId}/${groupId}`,{headers:{Authorization:token}})
            console.log('admin data',admin.data.adminId.userId)  //check admin
            let adminId = admin.data.adminId.userId;

                if(admin.data.message !== 'false'){
                  const group = document.getElementById('group');
                  const deleteGroup = document.createElement('button');
                  deleteGroup.className = 'btn btn-danger btn-sm';
                  deleteGroup.textContent = 'Delete Group';
                  deleteGroup.addEventListener('click', async() => {
                  await deleteTheGroup(groupId);  //to delete the group  
                  })
                 group.append(deleteGroup);              
                }
   
                    const memberList = await axios.get(`http://localhost:3000/admin/memberlist/${groupId}`,{
                        headers:{Authorization:token}
                    })
                    console.log('memberlist',memberList);  
        
                    // Members of the group
                    const members = document.getElementById('memberlist');

                      memberList.data.list.forEach((member) => {         /*memberlist the loop */
                        const user = document.createElement('div');
                          console.log(member.id,adminId)
                         if(adminId === member.id){
                          user.textContent = `Admin : ${member.name} - ${member.email} - ${member.phone_number}  `;
                          user.style.fontWeight = 'bold';
                          user.style.color = 'green';                            
                         }
                         else{
                         user.textContent = `Member : ${member.name} - ${member.email} - ${member.phone_number} `;
                          user.style.fontWeight = "bold";
                         }                 
                        
                        if(admin.data.message !== 'false'){ // *************  only for admins  ***********

                          const memberId = member.id;
                          if(memberId !== adminId){      // obviously only show to the user who is admin 
                             const removeBtn = document.createElement('button');
                             removeBtn.className = 'btn btn-danger btn-sm';
                             removeBtn.textContent = 'Remove';
                             removeBtn.addEventListener('click',async()=>{
                             await removeMember(memberId,groupId);   // to remove the member
                             })
        
                            const makeAdmin = document.createElement('button');
                            makeAdmin.className = 'btn btn-success btn-sm';
                            makeAdmin.textContent = 'Make Admin';
                            makeAdmin.addEventListener('click', async()=>{
                            console.log(memberId,groupId);
                            await changeAdmin(memberId,groupId);    //to remove the admin
                            })

                            user.append(removeBtn);
                            user.append(makeAdmin); 
                          }   
                      }
                        members.appendChild(user);
                    })

                    //get stored files
                    document.getElementById('file-container').addEventListener('click', async() => {
                      await getStoredFiles(groupId);
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
          localStorage.removeItem('link');
          window.location.href = `admin.html?groupId=${_groupId}`;
        }
        catch(error){
            document.getElementById('failure').textContent = 'Something went wrong';
        }
    }

    const deleteTheGroup = async(groupId) => {
      try{
          console.log(groupId);
          const token = localStorage.getItem('token'); 
          const group = await axios.get(`http://localhost:3000/admin/deletegroup/${groupId}`,{
            headers:{Authorization:token}});

          console.log(group.data.message);
          localStorage.removeItem('link');
          localStorage.removeItem('groupid');
          localStorage.removeItem('groupName');
          alert('Group deleted successfully')
          window.location.href = `group-chat.html`;

      }
      catch(error){   
        document.getElementById('failure').textContent = 'Something went wrong';
      }
    }

  const getStoredFiles = async(groupId) => {
      try{
          const token = localStorage.getItem('token'); 
          const storedFiles = await axios.get(`http://localhost:3000/file/getfiles/${groupId}`,
          {headers:{Authorization:token}});

          console.log(storedFiles.data);

          const Files = document.createElement('li');
          storedFiles.data.forEach((file) => {
            const File = document.createElement('ul');

            File.href = file.url;
            File.textContent = file.url;
            
            Files.appendChild(File);
          })
          
      }
      catch(err){
        console.log(err);
        document.getElementById('failure').textContent = 'Something went wrong';
      }
    }