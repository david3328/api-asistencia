const tabla = document.getElementById('tabla');
const btnRegistrar = document.getElementById('registrar');
const cursos = document.getElementById('cursos');
const dias = document.getElementById('dias');
const hora_inicio = document.getElementById('hora_inicio');
const hora_fin = document.getElementById('hora_fin');
listarCursos();
listarHorarios();

btnRegistrar.addEventListener('click',(e)=>{
  e.preventDefault();
  if(cursos.value!=-1 && dias.value!=-1 && hora_inicio.value !='' && hora_fin.value!='' ){
    let data = {curso:cursos.value,dia:dias.value,inicio:hora_inicio.value,fin:hora_fin.value}
    fetch('/api/guia/horario',{
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.success){
        alertify.success('¡Horario registrado!');
        listarHorarios();
      }else{
        alertify.error(res.message);
      }
      cursos.value = -1;
      dias.value=-1;
      hora_inicio.value='';
      hora_fin.value='';
    })
  }else{
    alertify.warning('¡Hay campos vacíos y/o no válidos!');
  }
})


function listarHorarios(){
  fetch('/api/guia/horarios')
  .then(res=>res.json())
  .then(res=>{
    if(res.success==true){
      if(res.data.length > 0){
        let html = '';
        let count = 0;
        res.data.map(el=>{
          count++;
          html += `<tr>
            <td>${el.id_grupo}-${el.nombre}</td>
            <td>${el.dia}</td> 
            <td>${el.hora_inicio}</td> 
            <td>${el.hora_fin}</td>
          </tr>` 
        })
        tabla.innerHTML = html;
      }else{
        tabla.innerHTML = `<td colspan="4"><p class="text-danger text-center">No hay horarios registrados.</p></td>`
      }
    }
  })
}

function listarCursos(){
  fetch('/api/guia/cursos')
  .then(res=>res.json())
  .then(res=>{
    if(res.success==true){
      if(res.data.length>0){
        let html = `<option value='-1'>Seleccionar curso</option>`;
        res.data.map(el=>{
          html += `<option value='${el.id_guia}'>${el.id_grupo} - ${el.nombre}</option>`
        })
        cursos.innerHTML = html;
      }else{
        cursos.innerHTML = `<option value='-1'>No hay cursos registrados</option>`
      }
    }
  })
}