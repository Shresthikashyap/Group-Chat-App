const urlSearchParams = new URLSearchParams(window.location.search);
const groupId = urlSearchParams.get('groupId');
console.log(groupId)

const save = async(event) =>{
    try{
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        const loginDetails = {
            email,password
        }

        let response;
        console.log('here')
        if(groupId){
            response = await axios.post(`http://localhost:3000/user/login?groupId=${groupId}`,loginDetails);
        }
        else{
            response = await axios.post("http://localhost:3000/user/login",loginDetails);
        }
        
        console.log('response',response)

        //document.getElementById('success').innerHTML = `${response.data.message}`;

        localStorage.setItem('token',response.data.token)
        
        if(groupId !== null){
            window.location.href = `group-chat.html?groupId=${groupId}`;
       }
       else{
            window.location.href = `group-chat.html`;
       }

    }
    catch(err){
        document.getElementById('failure').innerHTML = `Error: ${err.response.data.error}`
    }
}