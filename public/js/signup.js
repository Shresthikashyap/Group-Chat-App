
const save = async(event)=>{ 
    try{
    event.preventDefault(); 
    const name = event.target.username.value;
    const email = event.target.email.value;
    const phonenumber = event.target.phonenumber.value;
    const password = event.target.password.value;
 
    const obj= {
    name,email,phonenumber,password
    }
<<<<<<< HEAD
       
        let response = await axios.post("http://localhost:3000/user/signup",obj);
=======
        
        const groupId = localStorage.getItem('groupid')
        console.log(groupId)
        
           let response = await axios.post("http://localhost:3000/user/signup",obj);

>>>>>>> 76d2c29 (multiple groups)
       console.log(response);
       //document.getElementById('success').innerHTML = `:${ response.data.message}`;
       
       localStorage.setItem('name',response.data.name);
       localStorage.setItem('token',response.data.token)

       window.location.href = 'chat.html';
     
        }
        catch(err){
            document.getElementById('failure').innerHTML = `Error: ${ err.response.data.error}`;
        }
    }