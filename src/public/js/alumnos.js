const tabla = document.getElementById('tabla');
const btnRegistrar = document.getElementById('registrar');
const codigo = document.getElementById('codigo');
const nombres = document.getElementById('nombres');
const apaterno = document.getElementById('apellido_paterno');
const amaterno = document.getElementById('apellido_materno');
listar();

btnRegistrar.addEventListener('click',(e)=>{
  e.preventDefault();
  if(codigo.value!='' && nombres.value!='' && apaterno.value!='' && amaterno.value!=''){
    let data = {codigo:codigo.value,nombres:nombres.value,apaterno:apaterno.value,amaterno:amaterno.value};
    fetch('/api/alumno',{
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.success){
        alertify.success('¡Alumno registrado!');
        listar();
      }else{
        alertify.error(res.message);
      }
      codigo.value = '';
      nombres.value = '';
      apaterno.value = '';
      amaterno.value = '';
    })
  }else{
    alertify.warning('¡Hay campos vacíos!');
  }
});

function listar(){
  fetch('/api/alumno')
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
            <td>${el.id_alumno}</td>
            <td>${el.nombres} ${el.apellido_paterno} ${el.apellido_materno}</td>
          </tr>` 
        })
        tabla.innerHTML = html;
      }else{
        tabla.innerHTML = `<td colspan="2"><p class="text-danger text-center">No hay alumnos registrados.</p></td>`
      }
    }
  })
}