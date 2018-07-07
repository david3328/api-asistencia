const tabla = document.getElementById('tabla');
const btnRegistrar = document.getElementById('registrar');
const cursos = document.getElementById('cursos');
const docentes = document.getElementById('docentes');
const grupos = document.getElementById('grupos');
const semestres = document.getElementById('semestres');
listar();
listarCursos();
listarDocentes();
listarGrupos();
listarSemestres();

btnRegistrar.addEventListener('click',(e)=>{
  e.preventDefault();
  if(cursos.value!=-1 && docentes.value!=-1 && grupos.value!=-1 && semestres.value!=-1){
    let data = {curso:cursos.value,docente:docentes.value,grupo:grupos.value,semestre:semestres.value};
    fetch('/api/guia',{
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.success){
        alertify.success('¡Guía registrada!');
        listar();
      }else{
        alertify.error(res.message);
      }
      cursos.value = -1;
      docentes.value = -1;
      grupos.value = -1;
      semestres.value = -1;
    })
  }else{
    alertify.warning('¡Hay datos no válidos!')    
  }
})

function listarCursos(){
  fetch('/api/curso')
  .then(res=>res.json())
  .then(res=>{
    if(res.success==true){
      if(res.data.length>0){
        let html = `<option value='-1'>Seleccionar curso</option>`;
        res.data.map(el=>{
          html += `<option value='${el.id_curso}'>${el.nombre}</option>`
        })
        cursos.innerHTML = html;
      }else{
        cursos.innerHTML = `<option value='-1'>No hay cursos registrados</option>`
      }
    }
  })
}

function listarDocentes(){
  fetch('/api/docente')
  .then(res=>res.json())
  .then(res=>{
    if(res.success==true){
      if(res.data.length>0){
        let html = `<option value='-1'>Seleccionar docente.</option>`;
        res.data.map(el=>{
          html += `<option value='${el.id_docente}'>${el.nombres} ${el.apellido_paterno}</option>`
        })
        docentes.innerHTML = html;
      }else{
        docentes.innerHTML = `<option value='-1'>No hay docentes registrados.</option>`
      }
    }
  })

}

function listarGrupos(){
  fetch('/api/guia/grupos')
  .then(res=>res.json())
  .then(res=>{
    if(res.success==true){
      if(res.data.length>0){
        let html = `<option value='-1'>Seleccionar grupo.</option>`;
        res.data.map(el=>{
          html += `<option value='${el.id_grupo}'>${el.id_grupo} ${el.year}</option>`
        })
        grupos.innerHTML = html;
      }else{
        grupos.innerHTML = `<option value='-1'>No hay grupos registrados.</option>`
      }
    }
  })
}

function listarSemestres(){
  fetch('/api/guia/semestres')
  .then(res=>res.json())
  .then(res=>{
    if(res.success==true){
      if(res.data.length>0){
        let html = `<option value='-1'>Seleccionar semestre.</option>`;
        res.data.map(el=>{
          html += `<option value='${el.id_semestre}'>${el.codigo}</option>`
        })
        semestres.innerHTML = html;
      }else{
        semestres.innerHTML = `<option value='-1'>No hay semestres registrados.</option>`
      }
    }
  })
}

function listar(){
  fetch('/api/guia')
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
            <td>${el.grupo}</td>
            <td>${el.semestre}</td>
            <td>${el.curso}</td> 
            <td>${el.docente}</td> 
          </tr>` 
        })
        tabla.innerHTML = html;
      }else{
        tabla.innerHTML = `<td colspan="4"><p class="text-danger text-center">No hay guias registradas.</p></td>`
      }
    }
  })
}