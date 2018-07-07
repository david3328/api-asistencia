const btnMenu = document.getElementById('toggle-menu');
const menu = document.getElementById('menu');
const nav = document.getElementById('nav');

btnMenu.addEventListener('click',()=>{
  hideMenu();
});
nav.addEventListener('click',(e)=>{
  if(e.target===nav){hideMenu()}
})

function hideMenu(){
  if(btnMenu.getAttribute('class') == 'fa fa-bars'){
    btnMenu.classList.remove('fa-bars');
    btnMenu.classList.add('fa-times');
    menu.style.left = '0px';
    nav.style.width = '100%';
    nav.style.background = 'rgba(0,0,0,.3)'
  }else{
    btnMenu.classList.remove('fa-times');
    btnMenu.classList.add('fa-bars');
    menu.style.left = '-320px';
    nav.style.width = '0%';
    nav.style.background = 'rgba(0,0,0,0)'
  }
}