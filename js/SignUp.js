let inputs=Array.from(document.getElementsByTagName('input'))
let btn=document.querySelector('[type=submit]')
let error=document.getElementById('error')
    
btn.addEventListener('click',(event)=>{
    event.preventDefault()
    if(inputs.some(input=>input.value==''))
    {
        error.innerHTML='All fields must be filled'
    }
    else if(inputs.every(input=>input.value===localStorage.getItem(input.id)))
    {
        error.innerHTML='This user is already registered'
    }
    else 
    {
        localStorage.setItem('first-name',inputs.find(input=>input.id==='first-name').value)
        localStorage.setItem('last-name',inputs.find(input=>input.id==='last-name').value)
        localStorage.setItem('Email',inputs.find(input=>input.id==='Email').value)
        localStorage.setItem('password',inputs.find(input=>input.id==='password').value)
        error.innerHTML=''
        setTimeout(()=>{location.assign('Login.html')},2000)
    }
})