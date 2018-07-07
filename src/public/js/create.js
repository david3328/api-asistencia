const btnCrear = document.getElementById('crear');
const btnConectar = document.getElementById('conectar');
const docentes = document.getElementById('docentes');
const cursos = document.getElementById('cursos');
const tabla = document.getElementById('tabla');
const fecha = document.getElementById('fecha');
btnConectar.disabled = true;
listarDocentes();


let data = new Date();

setInterval(()=>{
  data.setSeconds(data.getSeconds() + 1);
  let hora = data.toLocaleTimeString('it-IT');
  fecha.innerHTML = `ASISTENCIA ${data.toLocaleDateString()} ${hora}`;  
},1000);

docentes.addEventListener('change',()=>{
  if(docentes.value!=-1){
    listarCursos(docentes.value);
  }
})

btnCrear.addEventListener('click',(e)=>{
  e.preventDefault();
  alertify.success('asistencia creada');
  btnCrear.disabled = true;
  btnConectar.disabled = false;
})

btnConectar.addEventListener('click',(e)=>{
  e.preventDefault();
})

function listarDocentes(){
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