const tabla = document.getElementById('tabla');
const btnRegistrar = document.getElementById('registrar');
const btnBuscar = document.getElementById('buscar');
const codigo = document.getElementById('codigo');
const idalumno = document.getElementById('idalumno');
const alumno = document.getElementById('alumno');
const cursos = document.getElementById('cursos');
listarCursos();

cursos.addEventListener('change',()=>{
  if(cursos.value!=-1){
    listarAlumnos(cursos.value);
  }
})

btnBuscar.addEventListener('click', (e) => {
  e.preventDefault();
  if (codigo.value != '') {
    let codalumno = codigo.value;
    fetch(`/api/alumno/${codalumno}`)
      .then(res => res.json())
      .then(res => {
        if (res.success == true && res.data) {
          let estudiante = res.data;
          alumno.value = `${estudiante.nombres} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}`;
          idalumno.value = `${estudiante.id_alumno}`;
        }
      })
  }else{
    alertify.warning('¡Ingrese código universitario!');
  }
})

btnRegistrar.addEventListener('click', (e) => {
  e.preventDefault();
  if (idalumno.value != '' && cursos.value != -1) {
    let data = {idalumno:idalumno.value,curso:cursos.value}
    fetch('/api/guia/matricula', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          alertify.success('¡Matrícula registrada!');
          listarAlumnos(cursos.value);
        }else{
          alertify.error(res.message);
        }
        cursos.value = -1;
        idalumno.value = '';
        alumno.value = '';
        codigo.value = '';
      })
  }else{
    alertify.warning('¡Hay campos vacíos y/o no válidos!');
  }
})

function listarAlumnos(guia) {
  fetch(`/api/guia/alumnos/${guia}`)
    .then(res => res.json())
    .then(res => {
      if (res.success == true) {
        if (res.data.length > 0) {
          let html = '';
          let count = 0;
          res.data.map(el => {
            count++;
            html += `<tr>
            <td>${el.id_alumno}</td>
            <td>${el.nombres} ${el.apellido_paterno} ${el.apellido_materno}</td>
          </tr>`
          })
          tabla.innerHTML = html;
        } else {
          tabla.innerHTML = `<td colspan="2"><p class="text-danger text-center">No hay alumnos matriculados.</p></td>`
        }
      }
    })
}

function listarCursos() {
  fetch('/api/guia/cursos')
    .then(res => res.json())
    .then(res => {
      if (res.success == true) {
        if (res.data.length > 0) {
          let html = `<option value='-1'>Seleccionar curso</option>`;
          res.data.map(el => {
            html += `<option value='${el.id_guia}'>${el.id_grupo} - ${el.nombre}</option>`
          })
          cursos.innerHTML = html;
        } else {
          cursos.innerHTML = `<option value='-1'>No hay cursos registrados</option>`
        }
      }
    })
}