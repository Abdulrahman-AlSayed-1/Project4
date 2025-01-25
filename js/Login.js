let email=document.getElementById('Email')
let password=document.getElementById('password')
let remember=document.getElementById('remember-me')
let btn=document.querySelector('[type=submit]')
let error=document.getElementById('error')

 if(localStorage.getItem('remember-me')==='true')
  {
         email.value=localStorage.getItem(email.id)
         password.value=localStorage.getItem(password.id)
         remember.checked=true
  }
  
btn.addEventListener('click',(event)=>{
    event.preventDefault()
    if(email.value==='' || password.value==='')
    {
        error.innerHTML='All fields must be filled'
    }
    else if(password.value!==localStorage.getItem(password.id) || email.value!==localStorage.getItem(email.id))
    {
        error.innerHTML='Incorrect Email or Password'
    }
    else 
    {
       if(remember.checked)
        localStorage.setItem('remember-me','true')
       else
        localStorage.setItem('remember-me','false')
        
       error.innerHTML=''
       setTimeout(()=>{location.assign('index.html')},2000)

    }
})

