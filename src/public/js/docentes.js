const tabla = document.getElementById('tabla');
const btnRegistrar = document.getElementById('registrar');
const nombres = document.getElementById('nombres');
const apaterno = document.getElementById('apellido_paterno');
const amaterno = document.getElementById('apellido_materno');
const email = document.getElementById('email');
const phone = document.getElementById('telefono');
listar();

btnRegistrar.addEventListener('click',(e)=>{
  e.preventDefault();
  if(nombres.value!='' && apaterno.value!='' && amaterno.value!='' && email.value!='' && phone.value!=''){
    let data = {nombres:nombres.value,apaterno:apaterno.value,amaterno:amaterno.value,email:email.value,phone:phone.value};
    fetch('/api/docente',{
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.success){
        alertify.success('¡Docente registrado!');
        listar();
      }else{
        alertify.error(res.message);
      }
      nombres.value = '';
      apaterno.value = '';
      amaterno.value = '';
      email.value = '';
      phone.value = '';
    })
  }else{
    alertify.warning('¡Hay campos vacíos!');
  }
});



function listar(){
  fetch('/api/docente')
  .then(res=>res.json())
  .then(res=>{
    if(res.success == true){
      if(res.data.length > 0){
        let html = '';
        let count = 0;
        console.log(res.data);
        res.data.map(el=>{
          count++;
          html += `<tr>
            <td>${count}</td>
            <td>${el.nombres} ${el.apellido_paterno} ${el.apellido_materno}</td>
            <td>${el.email}</td>
            <td>${el.telefono}</td>
          </tr>` 
        })
        tabla.innerHTML = html;
      }else{
        tabla.innerHTML = `<td colspan="4"><p class="text-danger text-center">No hay docentes registrados.</p></td>`
      }
    }
  })
}