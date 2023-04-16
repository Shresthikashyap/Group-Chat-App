const save = async(event) =>{
    try{
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        const loginDetails = {
            email,password
        }

        let response = axios.post("http://localhost:3000/user/login",loginDetails);
        console.log('response',response)

        document.getElementById('success').innerHTML = `${response.data.message}`;

    }
    catch(err){
        document.getElementById('failure').innerHTML = `Error: ${err.response.data.error}`
    }
}