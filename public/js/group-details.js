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
            const groupId = localStorage.getItem('groupid'); 
            console.log(groupName)
            if(groupName){
              const group = document.getElementById('group');
              group.textContent = `${groupName}  `;
            }

            const token = localStorage.getItem('token');
            const decodedToken = await parseJwt(token);
            const userId = decodedToken.id;

            // if user is admin show the link
            const checkAdmin = await axios.get(`http://3.27.43.97:3000/admin/checkadmin/${userId}/${groupId}`,{headers:{Authorization:token}})
            console.log('haan hun mei admin ',checkAdmin.data.admin)
            if(checkAdmin.data.admin === null){ window.location.href = `group-list.html?groupId=${groupId}`;};
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
               

            const group = document.getElementById('group');
            const exitGroupBtn = document.createElement('button');
            const br = document.createElement('br');
            exitGroupBtn.className = 'btn btn-secondary btn-sm';
            exitGroupBtn.innerHTML = 'Exit From Group';
            exitGroupBtn.addEventListener('click', async() =>{
            await exitGroup(userId,groupId);
            });
            group.append(br);
            group.append(exitGroupBtn);

             
            // Main thing starts from here
            console.log('admin data',checkAdmin.data.admin.userId)  //check admin
            let adminId = null;
            if(checkAdmin.data.admin.isAdmin === true){
              adminId = checkAdmin.data.admin.userId;
            }
                //show the delete button to admin
                if(checkAdmin.data.admin.isAdmin === true){
                  const group = document.getElementById('group');
                  const deleteGroup = document.createElement('button');
                  deleteGroup.className = 'btn btn-danger btn-sm';
                  deleteGroup.textContent = 'Delete Group';
                  deleteGroup.addEventListener('click', async() => {
                  await deleteTheGroup(groupId);  //to delete the group  
                  })
                 group.append(deleteGroup);              
                }
   
                    const memberList = await axios.get(`http://3.27.43.97:3000/group/memberlist/${groupId}`,{
                        headers:{Authorization:token}
                    })
                    console.log('memberlist',memberList);  //check the data
        
                    // Members of the group
                    const members = document.getElementById('memberlist');

                      memberList.data.list.forEach(async(member) => {         /*memberlist the loop */

                        const user = document.createElement('div'); console.log(member.id)
                         
                        //checking admin by passing the member id
                        const admin = await axios.get(`http://3.27.43.97:3000/admin/checkadmin/${member.id}/${groupId}`,{headers:{Authorization:token}})
                        console.log(admin.data.admin.isAdmin)
                         if(admin.data.admin.isAdmin === true ){
                          user.textContent = `Admin : ${member.name} - ${member.email} - ${member.phone_number}  `;
                          user.style.fontWeight = 'bold';
                          user.style.color = 'green';                            
                         }
                         else{
                         user.textContent = `Member : ${member.name} - ${member.email} - ${member.phone_number} `;
                          user.style.fontWeight = "bold";
                         }                 
                        
                           // *************  only for admins  ***********
                          const memberId = member.id;
                          
                          if(checkAdmin.data.admin.isAdmin === true){
                          
                            if(admin.data.admin.isAdmin === true){      // if the member is admin
                              const deleteAdmin = document.createElement('button');
                              deleteAdmin.className = 'btn btn-secondary btn-sm';
                              deleteAdmin.textContent = 'Remove as Admin';
                              deleteAdmin.addEventListener('click', async()=>{
                                console.log(memberId,groupId);
                                await removeAdmin(memberId,groupId);    //to remove the admin
                              }) 
                              user.append(deleteAdmin); 
                            }
                            else{
                              const makeAdmin = document.createElement('button');
                              makeAdmin.className = 'btn btn-success btn-sm';
                              makeAdmin.textContent = 'Make Admin';
                              makeAdmin.addEventListener('click', async()=>{
                                console.log(memberId,groupId);
                                await newAdmin(memberId,groupId);    //to make the admin
                              }) 

                              user.append(makeAdmin);                           
                            }
                            
                            if(userId !== memberId){                  
                             const removeBtn = document.createElement('button');
                             removeBtn.className = 'btn btn-danger btn-sm';
                             removeBtn.textContent = 'Remove from Group';
                             removeBtn.addEventListener('click',async()=>{
                             await removeMember(memberId,groupId);   // to remove the member
                             })
        
                            user.append(removeBtn); 
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

    // remove the member
    const removeMember = async(userId,groupId) =>{
        try{
            console.log(userId,groupId)
            const token = localStorage.getItem('token'); 
            const removedUser = await axios.get(`http://3.27.43.97:3000/admin/removeuser/${userId}/${groupId}`,
            {headers:{Authorization:token}});
        
            console.log(removedUser);
             alert(' Removed Successfully');
             window.location.href = `group-details.html?groupId=${groupId}`;
        }
        catch(error){
            document.getElementById('failure').textContent = 'Something went wrong';
        }
    }

    // make member a mew admin
    const newAdmin = async(memberId, _groupId) => {
        try{
          console.log(memberId,_groupId)
          const token = localStorage.getItem('token')
          const adminDetails = await axios.get(`http://3.27.43.97:3000/admin/makeadmin/${memberId}/${_groupId}`,
          {headers:{Authorization:token}});

          console.log(adminDetails.data);
          alert(`You made a new admin for this Group`);
          //localStorage.removeItem('link');
          window.location.href = `group-details.html?groupId=${_groupId}`;
        }
        catch(error){
            document.getElementById('failure').textContent = 'Something went wrong';
        }
    }

    // remove member as an admin
    const removeAdmin = async(memberId, _groupId) => {
      try{
        console.log(memberId,_groupId)
        const token = localStorage.getItem('token')
        const adminDetails = await axios.get(`http://3.27.43.97:3000/admin/removeadmin/${memberId}/${_groupId}`,
        {headers:{Authorization:token}});

        console.log(adminDetails.data);
        alert(`You are no longer admin for this Group`);
        //localStorage.removeItem('link');
        window.location.href = `group-details.html?groupId=${_groupId}`;
      }
      catch(error){
          document.getElementById('failure').textContent = 'Something went wrong';
      }
  }

  //exit from group
  const exitGroup = async(userId,groupId) =>{
    try{
      const token = localStorage.getItem('token');
      const group = await axios.get(`http://3.27.43.97:3000/group/exitgroup/${userId}/${groupId}`,{
        headers:{Authorization:token}});

        console.log(group.data.message);
        localStorage.removeItem('link');
        localStorage.removeItem('groupid');
        localStorage.removeItem('groupName');
        alert('You are no longer a part of this group')
        window.location.href = `group-list.html`;
    }
    catch(error){
      document.getElementById('failure').textContent = 'Something went wrong';
    }
  }

  //delete the group
    const deleteTheGroup = async(groupId) => {
      try{
          console.log(groupId);
          const token = localStorage.getItem('token'); 
          const group = await axios.get(`http://3.27.43.97:3000/admin/deletegroup/${groupId}`,{
            headers:{Authorization:token}});

          console.log(group.data.message);
          localStorage.removeItem('link');
          localStorage.removeItem('groupid');
          localStorage.removeItem('groupName');
          alert('Group deleted successfully')
          window.location.href = `group-list.html`;

      }
      catch(error){   
        document.getElementById('failure').textContent = 'Something went wrong';
      }
    }

    //get stored file
  const getStoredFiles = async(groupId) => {
      try{
          const token = localStorage.getItem('token'); 
          const storedFiles = await axios.get(`http://3.27.43.97:3000/file/getfiles/${groupId}`,
          {headers:{Authorization:token}});

          console.log(storedFiles.data);

          if(storedFiles.data.length > 0){ 
            document.getElementById('memberlist').textContent = ' ';

            const urls = document.getElementById('filelist');
            urls.style.height ='244px'; 

            for(let i=0; i < storedFiles.data.length; i++){
              const data = storedFiles.data[i].url;

              const link = document.createElement('a');
              link.href = data;
              link.textContent = data.slice(0, 50 - 3) + "...";
              
              const urlList = document.createElement('li');
              urlList.appendChild(link);
              urls.appendChild(urlList);
            }
          }else{
              alert('no shared files')
          }
      }
      catch(err){
        console.log(err);
        document.getElementById('failure').textContent = 'Something went wrong';
      }
    }

   //sign out from the page
    const signOut = () =>{
      localStorage.removeItem('groupid');
      localStorage.removeItem('groupName');
      localStorage.removeItem('link');
      window.location.href = 'login.html'
    }

    //move to group list page
    const checkGroupList = () =>{
      localStorage.removeItem('groupid');
      localStorage.removeItem('groupName');
      localStorage.removeItem('link');
      window.location.href = 'group-list.html'
    }