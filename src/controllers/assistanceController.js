const ps = require('pg-promise').PreparedStatement;
const db = require('../database/db');

exports.createAssistencia = (req,res)=>{
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
