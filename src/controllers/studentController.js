const db = require('../database/db');
const ps = require('pg-promise').PreparedStatement;

exports.setAlumno = (req,res)=>{
  let codigo = req.body.codigo;
  let nombres = req.body.nombres;
  let apaterno = req.body.apaterno;
  let amaterno = req.body.amaterno;
  let query = 'INSERT INTO alumnos VALUES ($1,$2,$3,$4)';
  let regAlumno = new ps('regAlumno',query,[codigo,nombres,apaterno,amaterno])
  db.none(regAlumno)
  .then(()=>{
    res.status(200).json({success:true})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.getAlumnos = (req,res)=>{
  let query = 'SELECT id_alumno,nombres,apellido_paterno,apellido_materno FROM alumnos';
  let alumnos = new ps('alumnos',query);
  db.any(alumnos)
  .then(data=>{
    res.status(200).json({success:true,data})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.getAlumno = (req,res)=>{
  let idalumno = req.params.idalumno;
  let query = `SELECT id_alumno,nombres,apellido_paterno,apellido_materno FROM alumnos WHERE id_alumno = $1`;
  let alumno = new ps('alumno',query,idalumno);
  db.one(alumno)
  .then(data=>{
    res.status(200).json({success:true,data})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}