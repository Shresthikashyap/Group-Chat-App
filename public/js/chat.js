window.addEventListener('DOMContentLoaded',async= ()=>{
    
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);  
        const name = decodedToken.name;
        document.getElementById('name').innerHtml = `${name} joined`;
    
})