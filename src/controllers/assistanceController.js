const ps = require('pg-promise').PreparedStatement;
const db = require('../database/db');

exports.getTeachers = (req,res)=>{
  const query = `SELECT id_docente, apellido_paterno || ' '|| apellido_materno ||', '|| nombres AS docente FROM docentes`;
  const docentes = new ps('docentes',query);
  db.any(docentes)
  .then(data=>{
    res.status(200).json({success:true,data})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}


exports.getCourses = (req,res)=>{
  const idTeacher = req.params.idTeacher;
  const query = `SELECT G.id_grupo, C.nombre, H.dia , H.hora_inicio, H.hora_fin, H.id_horario
                FROM horarios AS H 
                INNER JOIN guias AS GU ON GU.id_guia = H.id_guia
                INNER JOIN cursos AS C ON C.id_curso = GU.id_curso
                INNER JOIN grupos AS G ON G.id_grupo = GU.id_grupo
                WHERE GU.id_docente = $1`;
  const cursos = new ps('cursos',query,idTeacher);
  db.any(cursos)
  .then(data=>{
    res.status(200).json({success:true,data})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.getAsistencias = (req,res)=>{
  let idhorario = req.params.idHorario;
  let query = `SELECT a.id_asistencia, a.fecha, h.hora_inicio,h.hora_fin 
  FROM asistencias a 
  INNER JOIN horarios h ON h.id_horario = a.id_horario 
  WHERE h.id_horario = $1`;
  const asistencias = new ps('asistencias',query,idhorario);
  db.any(asistencias)
  .then(data=>{
    res.status(200).json({success:true,data})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.getAlumnos = (req,res)=>{
  let asistencia = req.params.idAsistencia;
  let query = `SELECT a.id_alumno, a.nombres, a.apellido_paterno, a.apellido_materno 
  FROM alumno_asistencia aa 
  INNER JOIN alumnos a ON a.id_alumno = aa.id_alumno
  WHERE id_asistencia = $1`;
  const alumnos = new ps('alumnos',query,asistencia);
  db.any(alumnos)
  .then(data=>{
    res.status(200).json({success:true,data})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.createAssistance = (req,res)=>{
  const idHorario = req.body.idHorario;
  const query = 'INSERT INTO asistencias (id_horario) VALUES ($1) RETURNING id_asistencia';
  const asistencia = new ps('asistencia',query,idHorario);
  db.one(asistencia)
  .then(data=>{
    res.status(200).json({success:true,message:'Creada asistencia.',data});
  })
  .catch(err=>{
    res.status(400).json({success:false,message:err.message,err});
    console.log('ERROR: ',err.message || err);
  })
}

exports.setAssistance = (req,res)=>{
  const idAlumno = req.body.idAlumno;
  const idAsistencia = req.body.idAsistencia;
  const query = 'SELECT fn_asistencia AS response FROM fn_asistencia($1,$2)';
  const assistance = new ps('assistance',query,[idAlumno,idAsistencia]);
  db.one(assistance)
  .then(data=>{
    if(data.response!=0)
      return res.status(200).json({success:true,message:'Alumno pertenece al curso.'});
    sendSMS(req,res);
  })
  .catch(err=>{
    res.status(400).json({success:false,message:err.message,err});
    console.log('ERROR: ', err.message || err);
  })
}

sendSMS = (req,res)=>{
  let idAsistencia = req.body.idAsistencia;
  const query = 'SELECT fn_telefono AS response FROM fn_telefono($1)';
  const phone = new ps('phone',query,idAsistencia);
  db.one(phone)
  .then(data=>{
    // Acá se envía el sms
  })
  .catch(err=>{
    res.status(400).json({success:false,message:err.message,err});
    console.log('ERROR: ',err.message || err);
  })
}
