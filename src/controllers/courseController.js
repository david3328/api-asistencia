const db = require('../database/db');
const ps = require('pg-promise').PreparedStatement;

exports.setCurso = (req,res)=>{
  let codigo = req.body.codigo;
  let nombre = req.body.nombre;
  let creditos = req.body.creditos;
  let ciclo = req.body.ciclo;
  let ht = req.body.ht;
  let hp = req.body.hp;
  let hl = req.body.hl;
  let hs = req.body.hs;
  let ha = req.body.ha;
  let curso = req.body.curso; 
  let query = 'INSERT INTO cursos(id_curso,nombre,creditos,ciclo,ht,hp,hl,hs,ha,requisito) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)';
  let regCurso = new ps('regCurso',query,[codigo,nombre,creditos,ciclo,ht,hp,hl,hs,ha,curso]);
  db.none(regCurso)
  .then(()=>{
    res.status(200).json({success:true});
  })
  .catch(err=>{
    res.status(400).json({success:false,message:err.message,err});
    console.log('ERROR: ',err.message || err);
  })
}

exports.getCursos = (req,res)=>{
  let query = 'SELECT id_curso,nombre,creditos,ciclo FROM cursos ORDER BY ciclo';
  let cursos = new ps('cursos',query);
  db.any(cursos)
  .then(data=>{
    res.status(200).json({success:true,data});
  })
  .catch(err=>{
    res.status(400).json({success:false,message:err.message,err});
    console.log('ERROR: ',err.message || err);
  })
}