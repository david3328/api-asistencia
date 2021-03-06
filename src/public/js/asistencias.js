const docentes = document.getElementById('docentes');
const cursos = document.getElementById('cursos');
const horarios = document.getElementById('horarios');
const btnGuardar = document.getElementById('guardar');
const btnImprimir = document.getElementById('print');
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

btnGuardar.addEventListener('click',()=>{
  alertify.confirm("¿Deseas crear asistencia para éste horario?",
    function(){
      tableToExcel('testTable', 'W3C Example Table')
      alertify.success('Datos guardados');
    },
    function(){
      alertify.error('Cancelado');
    })
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
          html += `<option value='${el.id_asistencia}'>${el.fecha.substring(0, 10)} - ${el.dia} de ${el.hora_inicio} hasta ${el.hora_fin}</option>`
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
          el.alumno = el.tipo==1? 'DOCENTE':'ALUMNO';
          html += `<tr>
            <td>${el.id}</td>
            <td>${el.nombres} ${el.apellido_paterno} ${el.apellido_materno}</td>
            <td>${el.alumno}</td>
          </tr>` 
        })
        tabla.innerHTML = html;
      }else{
        tabla.innerHTML = `<td colspan="2"><p class="text-danger text-center">No hay alumnos registrados.</p></td>`
      }
    }
  })
}

var tableToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
  return function(table, name) {
    if (!table.nodeType) table = document.getElementById(table)
    var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
    window.location.href = uri + base64(format(template, ctx))
  }
})()


$('#print').click(()=>{
  printContent('report');
})


function printContent(el){
  var restorepage = $('body').html();
  var printcontent = $('#' + el).clone();
  $('body').empty().html(printcontent);
  window.print();
  $('body').html(restorepage);
  }