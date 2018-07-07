const db = require('../database/db');
const ps = require('pg-promise').PreparedStatement;

exports.setDocente = (req,res)=>{
  console.log(req.body.phone);
  let nombres = req.body.nombres;
  let apaterno = req.body.apaterno;
  let amaterno = req.body.amaterno;
  let email = req.body.email;
  let phone = req.body.phone;
  let query = 'INSERT INTO docentes(nombres,apellido_paterno,apellido_materno,email,telefono) VALUES($1,$2,$3,$4,$5)';
  let reg = new ps('reg',query,[nombres,apaterno,amaterno,email,phone])
  db.none(reg)
  .then(()=>{
    res.status(200).json({success:true})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.getDocente = (req,res)=>{
  let query = 'SELECT id_docente,nombres,apellido_paterno,apellido_materno,email,telefono FROM docentes';
  let docentes = new ps('docentes',query);
  db.any(docentes)
  .then(data=>{
    res.status(200).json({success:true,data})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}