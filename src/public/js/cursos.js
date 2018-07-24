const tabla = document.getElementById('tabla');
const btnRegistrar = document.getElementById('registrar');
const codigo = document.getElementById('codigo');
const nombre = document.getElementById('nombre');
const creditos = document.getElementById('creditos');
const ciclo = document.getElementById('ciclo');
const ht = document.getElementById('ht');
const hp = document.getElementById('hp');
const hl = document.getElementById('hl');
const hs = document.getElementById('hs');
const ha = document.getElementById('ha');
const cursos = document.getElementById('cursos');
listar();
listarCursos();

btnRegistrar.addEventListener('click',(e)=>{
  e.preventDefault();
  if(codigo.value!='' && nombre.value!='' && creditos.value!='' && ciclo.value!='' && ht.value!=''
     && hp.value!='' && hl.value!='' && hs.value!='' && ha.value!='' && cursos.value!=-1 ){
      let data = {codigo:codigo.value,nombre:nombre.value,creditos:creditos.value,ciclo:ciclo.value,
                  ht:ht.value,hp:hp.value,hl:hl.value,hs:hs.value,ha:ha.value,curso:cursos.value}
      fetch('/api/curso',{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res=>res.json())
      .then(res=>{
        if(res.success){
          alertify.success('¡Curso registrado!');
          listar();
          listarCursos();
        }else{
          alertify.error(res.message);
        }
        codigo.value = '';
        nombre.value = '';
        creditos.value = '';
        ciclo.value = '';
        cursos.value = -1;
        ht.value = '';
        hp.value = '';
        hl.value = '';
        hs.value = '';
        ha.value = '';
      })
     }else{
       alertify.warning('¡Hay campos vacíos!')
     }
});

function listarCursos(){
  fetch('/api/curso')
  .then(res=>res.json())
  .then(res=>{
    if(res.success==true){
      if(res.data.length>0){
        let html = `<option value='-1'>Seleccionar curso</option>`;
        html += `<option value=''>NO HAY REQUISITO</option>`;
        res.data.map(el=>{
          html += `<option value='${el.id_curso}'>${el.nombre}</option>`
        })
        cursos.innerHTML = html;
      }else{
        cursos.innerHTML = `<option value='-1'>Seleccionar curso</option>
        <option value=''>NO HAY REQUISITO</option>`
      }
    }
  })
}

function listar(){
  fetch('/api/curso')
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
            <td>${el.id_curso}</td>
            <td>${el.nombre}</td> 
            <td>${el.creditos}</td> 
            <td>${el.ciclo}</td>
          </tr>` 
        })
        tabla.innerHTML = html;
      }else{
        tabla.innerHTML = `<td colspan="4"><p class="text-danger text-center">No hay cursos registrados.</p></td>`
      }
    }
  })
}