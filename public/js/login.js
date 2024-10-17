// get the api url
async function getApiUrl() {
    const response = await fetch('/api/config');
    const data = await response.json();
    return data.apiUrl;
};

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
        const apiUrl = await getApiUrl();

        if(groupId){

            response = await axios.post(`${apiUrl}/user/login?groupId=${groupId}`,loginDetails);
        }else{
            response = await axios.post(`${apiUrl}/user/login`,loginDetails);
        }
        
        console.log('response',response)

        if(response.data.groupDetails !== null) {
            console.log(response.data.groupDetails);
            localStorage.setItem('groupid',response.data.groupDetails.id);
            localStorage.setItem('groupName',response.data.groupDetails.groupName);
        }

        //document.getElementById('success').innerHTML = `${response.data.message}`;
        localStorage.setItem('name',response.data.name);
        localStorage.setItem('token',response.data.token);
        //localStorage.setItem('groupName',response.data.groupDetails.groupName);
        if(groupId !== null){
            localStorage.removeItem('link');
            window.location.href = `group-chat.html?groupId=${groupId}`;
        }
        else{
            window.location.href = `group-list.html`;
        }
    }
    catch(err){
        document.getElementById('failure').innerHTML = `Error: ${err.response.data.error}`
    }
}
