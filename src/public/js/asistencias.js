const docentes = document.getElementById('docentes');
const cursos = document.getElementById('cursos');
const horarios = document.getElementById('horarios');
listarDocentes();

docentes.addEventListener('change',()=>{
  if(docentes.value!=-1){
    listarCursos(docentes.value);
  }
})

cursos.addEventListener('change',()=>{
  if(cursos.value!=-1){
    listarAsistencias(cursos.value);
  }
})

horarios.addEventListener('change',()=>{
  if(horarios.value!=-1){
    listarAlumnos(horarios.value);
  }
})

function listarDocentes() {
  fetch('/api/asistencia/profesores')
    .then(res => res.json())
    .then(res => {
      if (res.success == true) {
        if (res.data.length > 0) {
          let html = `<option value='-1'>Seleccionar docente</option>`;
          res.data.map(el => {
            html += `<option value='${el.id_docente}'>${el.docente}</option>`
          })
          docentes.innerHTML = html;
        } else {
          docentes.innerHTML = `<option value='-1'>No hay docentes registrados</option>`
        }
      }
    })
}

function listarCursos(docente) {
  fetch(`/api/asistencia/cursos/${docente}`)
    .then(res => res.json())
    .then(res => {
      if (res.success == true) {
        if (res.data.length > 0) {
          let html = `<option value='-1'>Seleccionar curso</option>`;
          res.data.map(el => {
            html += `<option value='${el.id_horario}'>${el.id_grupo} - ${el.dia} de ${el.hora_inicio} a ${el.hora_fin} - ${el.nombre}</option>`
          })
          cursos.innerHTML = html;
        } else {
          cursos.innerHTML = `<option value='-1'>No hay cursos registrados</option>`
        }
      }
    })
}

function listarAsistencias(horario){
  fetch(`/api/asistencia/${horario}`)
  .then(res => res.json())
  .then(res => {
    if (res.success == true) {
      if (res.data.length > 0) {
        let html = `<option value='-1'>Seleccionar asistencia</option>`;
        res.data.map(el => {
          html += `<option value='${el.id_asistencia}'>${el.fecha}-${el.hora_inicio}::${el.hora_fin}</option>`
        })
        horarios.innerHTML = html;
      } else {
        horarios.innerHTML = `<option value='-1'>No hay asistencias registradas</option>`
      }
    }
  })
}


function listarAlumnos(asistencia){
  fetch(`/api/asistencia/alumnos/${asistencia}`)
  .then(res=>res.json())
  .then(res=>{
    if(res.success == true){
      if(res.data.length > 0){
        let html = '';
        let count = 0;
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