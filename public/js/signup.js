// Fetch the API URL from the backend
async function getApiUrl() {
        const response = await fetch('/api/config');
        const data = await response.json();
        return data.apiUrl;
};


// get the url 
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

    let apiUrl = await getApiUrl();
    console.log(apiUrl)
    //const apiUrl = process.env.API_URL || `http://localhost:3000`;
    
    let response;    
        
        if(groupId){
            response = await axios.post(`${apiUrl}/user/signup?groupId=${groupId}`,obj);
        }
        else{
            console.log(name, email, phonenumber, password)
            response = await axios.post(`${apiUrl}/user/signup`,obj);
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
