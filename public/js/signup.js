
const save = async(event)=>{ 
    try{
    event.preventDefault(); 
    const name = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
 
    const obj= {
    name,email,password
    }
       
        let response = await axios.post("http://localhost:3000/users/signup",obj);
       console.log(response);
       document.getElementById('success').innerHTML = `:${ err.response.data.message}`;
     
        }
        catch(err){
            document.getElementById('failure').innerHTML = `Error: ${ err.response.data.error}`;
        }
    }