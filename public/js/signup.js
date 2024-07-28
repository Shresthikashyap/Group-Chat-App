const urlSearchParams = new URLSearchParams(window.location.search);
const groupId = urlSearchParams.get('groupId');
console.log(groupId)

if(groupId){
    const userExists = window.confirm('if you already have an account then login?');
    if(userExists === true){
        window.location.href = `login.html?groupId=${groupId}`;
    } 
}

const save = async(event)=>{ 
    try{
    event.preventDefault(); 
    const name = event.target.username.value;
    const email = event.target.email.value;
    const phonenumber = event.target.phonenumber.value;
    const password = event.target.password.value;
 
    const obj= {
        name, email, phonenumber, password
    }

        let response;
        
        if(groupId){

            response = await axios.post(`http://localhost:3000/user/signup?groupId=${groupId}`,obj);
        }
        else{
            response = await axios.post("http://localhost:3000/user/signup",obj);

        }
        
       console.log(response); 
       if(response.data.groupDetails !== null) {
            console.log(response.data.groupDetails);
            localStorage.setItem('groupid',response.data.groupDetails.id);
            localStorage.setItem('groupName',response.data.groupDetails.groupName);
       }
    
      // document.getElementById('success').innerHTML = `:${ response.data.message}`;
      
       localStorage.setItem('name',response.data.name);
       localStorage.setItem('token',response.data.token);

        if(groupId !== null){
            localStorage.removeItem('link');
            window.location.href = `group-chat.html?groupId=${groupId}`;
        }
       else{
           window.location.href = `group-list.html`;
       }
     
        }
        catch(err){
            document.getElementById('failure').innerHTML = `Error: ${ err.response.data.error}`;
            console.log(err.response.data.error)
            if(err.response.data.error === 'User already exists' && groupId !== null){

                alert(`You need to login before joining the group ${groupId}`);
                window.location.href = `login.html?groupId=${groupId}`;
            }
        }
    }
