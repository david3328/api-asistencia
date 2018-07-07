const db = require('../database/db');
const ps = require('pg-promise').PreparedStatement;

exports.getGroups = (req,res)=>{
  let query = 'SELECT id_grupo,year FROM grupos';
  let grupos = new ps('grupos',query);
  db.any(grupos)
  .then(data=>{
    res.status(200).json({success:true,data});
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.getSemestres = (req,res)=>{
  let query = 'SELECT id_semestre,codigo,year FROM semestres';
  let semestres = new ps('semestres',query);
  db.any(semestres)
  .then(data=>{
    res.status(200).json({success:true,data});
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.getStudents = (req,res)=>{
  let guia = req.params.idGuia;
  let query = `SELECT a.id_alumno,a.nombres, a.apellido_paterno, a.apellido_materno
  FROM matriculas m
  INNER JOIN alumnos a ON a.id_alumno = m.id_alumno
  WHERE m.id_guia=$1`;
  let guideStudents = new ps('guideStudents',query,guia);
  db.any(guideStudents)
  .then(data=>{
    res.status(200).json({success:true,data});
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.setGuide = (req,res)=>{
  let curso = req.body.curso;
  let docente = req.body.docente;
  let grupo = req.body.grupo;
  let semestre = req.body.semestre;
  let query = 'INSERT INTO guias(id_curso,id_grupo,id_docente,id_semestre) VALUES ($1,$2,$3,$4)';
  let regGuide = new ps('regGuide',query,[curso,grupo,docente,semestre]);
  db.none(regGuide)
  .then(()=>{
    res.status(200).json({success:true})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.setMatricula = (req,res)=>{
  let idalumno = req.body.idalumno;
  let curso = req.body.curso;
  let query = `INSERT INTO matriculas(id_alumno,id_guia) VALUES ($1,$2)`;
  let regMatricula = new ps('regMatricula',query,[idalumno,curso]);
  db.none(regMatricula)
  .then(()=>{
    res.status(200).json({success:true})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.getGuides = (req,res)=>{
  let query = `SELECT c.nombre AS curso, d.nombres ||' '|| d.apellido_paterno AS docente, g.id_grupo AS grupo, s.codigo AS semestre
  FROM guias gu 
  INNER JOIN cursos c ON c.id_curso = gu.id_curso
  INNER JOIN docentes d ON d.id_docente = gu.id_docente
  INNER JOIN grupos g ON g.id_grupo = gu.id_grupo
  INNER JOIN semestres s ON s.id_semestre = gu.id_semestre
  `;
  let guides = new ps('guides',query);
  db.any(guides)
  .then(data=>{
    res.status(200).json({success:true,data})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.getCourses = (req,res)=>{
  let query = `SELECT g.id_guia,gr.id_grupo, c.nombre  
  FROM  guias AS g
  INNER JOIN cursos c ON c.id_curso = g.id_curso
  INNER JOIN grupos gr ON gr.id_grupo = g.id_grupo`
  let guiaCursos = new ps('guiaCursos',query);
  db.any(guiaCursos)
  .then(data=>{
    res.status(200).json({success:true,data})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.getHours = (req,res)=>{
  let query = `SELECT gr.id_grupo, c.nombre, h.dia, h.hora_inicio, h.hora_fin 
  FROM horarios h 
  INNER JOIN guias g ON g.id_guia = h.id_guia
  INNER JOIN cursos c ON c.id_curso = g.id_curso
  INNER JOIN grupos gr ON gr.id_grupo = g.id_grupo
  ORDER BY gr.id_grupo, g.id_curso`;
  let horarios = new ps('horarios',query);
  db.any(horarios)
  .then(data=>{
    res.status(200).json({success:true,data})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}

exports.setHour = (req,res)=>{
  let curso = req.body.curso;
  let dia = req.body.dia;
  let inicio = req.body.inicio;
  let fin = req.body.fin;
  let query = `INSERT INTO horarios(dia,hora_inicio,hora_fin,id_guia) VALUES ($1,$2,$3,$4)`;
  let regHour = new ps('regHour',query,[dia,inicio,fin,curso]);
  db.none(regHour)
  .then(()=>{
    res.status(200).json({success:true})
  })
  .catch(err=>{
    console.log('ERROR: ',err.message || err);
    res.status(400).json({success:false,message:err.message,err});
  })
}