let account=document.getElementById('accountimage');
let content=document.getElementById('account');
account.addEventListener ('click', ()=>{

content.style.display='block'

})

let cross=document.getElementById('cross');
cross.addEventListener('click',()=>{
    content.style.display='none'
})