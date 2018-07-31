const ps = require('pg-promise').PreparedStatement;
const db = require('../database/db');
const transporter = require('../services/mail');
const fetch = require('node-fetch');

exports.getTodayAssistance = (req, res) => {
  const query = `SELECT a.id_asistencia,g.id_grupo,h.dia, h.hora_inicio,h.hora_fin,
  d.nombres,d.apellido_paterno,c.nombre 
  FROM asistencias a 
  INNER JOIN horarios h ON h.id_horario = a.id_horario 
  INNER JOIN guias g ON g.id_guia = h.id_guia
  INNER JOIN cursos c ON c.id_curso = g.id_curso
  INNER JOIN docentes d ON d.id_docente = g.id_docente
  WHERE a.fecha::date = now()::date`;
  const asistencias = new ps('asistencias', query);
  db.any(asistencias)
    .then(data => {
      res.status(200).json({ success: true, data })
    })
    .catch(err => {
      console.log('ERROR: ', err.message || err);
      res.status(400).json({ success: false, message: err.message, err });
    })
}

exports.docenteAsistencia = (req, res) => {
  let email = req.body.email;
  let asistencia = req.body.asistencia;
  let query = `INSERT INTO docente_asistencia(id_asistencia,id_docente) VALUES($1,$2)`;
  let insertarDocente = new ps('insertarDocente', query, [asistencia, email]);
  db.none(insertarDocente)
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch(err => {
      console.log('ERROR: ', err.message || err);
      res.status(400).json({ success: false, message: err.message, err });
    })
}

exports.getTeachers = (req, res) => {
  const query = `SELECT id_docente, apellido_paterno || ' '|| apellido_materno ||', '|| nombres AS docente FROM docentes`;
  const docentes = new ps('docentes', query);
  db.any(docentes)
    .then(data => {
      res.status(200).json({ success: true, data })
    })
    .catch(err => {
      console.log('ERROR: ', err.message || err);
      res.status(400).json({ success: false, message: err.message, err });
    })
}

exports.getCourses = (req, res) => {
  const idTeacher = req.params.idTeacher;
  const query = `SELECT G.id_grupo, C.nombre, H.dia , H.hora_inicio, H.hora_fin, H.id_horario
                FROM horarios AS H 
                INNER JOIN guias AS GU ON GU.id_guia = H.id_guia
                INNER JOIN cursos AS C ON C.id_curso = GU.id_curso
                INNER JOIN grupos AS G ON G.id_grupo = GU.id_grupo
                WHERE GU.id_docente = $1`;
  const cursos = new ps('cursos', query, idTeacher);
  db.any(cursos)
    .then(data => {
      res.status(200).json({ success: true, data })
    })
    .catch(err => {
      console.log('ERROR: ', err.message || err);
      res.status(400).json({ success: false, message: err.message, err });
    })
}

exports.getAsistencias = (req, res) => {
  let idhorario = req.params.idHorario;
  let query = `SELECT a.id_asistencia, a.fecha::date,h.dia, h.hora_inicio,h.hora_fin 
  FROM asistencias a 
  INNER JOIN horarios h ON h.id_horario = a.id_horario 
  WHERE h.id_horario = $1`;
  const asistencias = new ps('asistencias', query, idhorario);
  db.any(asistencias)
    .then(data => {
      res.status(200).json({ success: true, data })
    })
    .catch(err => {
      console.log('ERROR: ', err.message || err);
      res.status(400).json({ success: false, message: err.message, err });
    })
}

exports.getAlumnos = (req, res) => {
  let asistencia = req.params.idAsistencia;
  let query = `  SELECT a.id_alumno id, a.nombres, a.apellido_paterno, a.apellido_materno, '0' as tipo 
  FROM alumno_asistencia aa 
  INNER JOIN alumnos a ON a.id_alumno = aa.id_alumno
  WHERE aa.id_asistencia = $1
  UNION 
  SELECT d.email id,d.nombres, d.apellido_paterno, d.apellido_materno, '1' as tipo
  FROM docente_asistencia da
  INNER JOIN docentes d ON d.email = da.id_docente
  WHERE da.id_asistencia = $2
  ORDER BY tipo desc`;
  const alumnos = new ps('alumnos', query, [asistencia, asistencia]);
  db.any(alumnos)
    .then(data => {
      res.status(200).json({ success: true, data })
    })
    .catch(err => {
      console.log('ERROR: ', err.message || err);
      res.status(400).json({ success: false, message: err.message, err });
    })
}

exports.createAssistance = (req, res) => {
  const email = req.body.email;

  db.func('fn_crear_asistencia', email)
    .then(data => {
      res.status(200).json({ success: true, message: 'Creada asistencia.', data: data[0].fn_crear_asistencia });
    })
    .catch(err => {
      res.status(400).json({ success: false, message: err.message, err });
      console.log('ERROR: ', err.message || err);
    })
}

exports.setAssistance = (req, res) => {
  const idAlumno = req.body.idAlumno;
  const idAsistencia = req.body.idAsistencia;
  const date = req.body.date;
  const query = 'SELECT fn_asistencia AS response FROM fn_asistencia($1,$2,$3)';
  const assistance = new ps('assistance', query, [idAlumno, idAsistencia, date]);
  db.one(assistance)
    .then(data => {
      if (data.response != 0)
        return res.status(200).json({ success: true, message: 'Alumno pertenece al curso.' });
      sendSMS(req, res);
    })
    .catch(err => {
      res.status(400).json({ success: false, message: err.message, err });
      console.log('ERROR: ', err.message || err);
    })
}

exports.offAssistance = (req, res) => {
  const idAlumno = req.body.idAlumno;
  const idAsistencia = req.body.idAsistencia;
  const date = req.body.date;
}


exports.finalizarAsistencia = (req, res) => {
  let idAsistencia = req.body.asistencia;
  let query = `  SELECT a.id_alumno id, a.nombres, a.apellido_paterno, a.apellido_materno, 'ALUMNO' as tipo 
  FROM alumno_asistencia aa 
  INNER JOIN alumnos a ON a.id_alumno = aa.id_alumno
  WHERE aa.id_asistencia = ${idAsistencia}
  UNION 
  SELECT d.email id,d.nombres, d.apellido_paterno, d.apellido_materno, 'DOCENTE' as tipo
  FROM docente_asistencia da
  INNER JOIN docentes d ON d.email = da.id_docente
  WHERE da.id_asistencia = ${idAsistencia}
  ORDER BY tipo desc`;
  db.any(query)
      .then(data => {
          console.log('ASISTENTES', data);
          let htmlS = '<ul>'
          data.map(el => {
              htmlS += `<li>${el.id}: ${el.nombres} ${el.apellido_paterno} ${el.apellido_materno} - ${el.tipo}</li>`;
          })
          htmlS += '</ul>';
          const mailOption = {
              from: 'clydejhon2@gmail.com',
              to: 'coco_29_aries@hotmail.com',
              subject: 'Reporte de asistencia',
              html: htmlS
          }
          transporter.sendMail(mailOption, (err, info) => {
              if (err) {
                  console.log('ERROR: ', err.message || err);
                  res.status(400).json({ success: false, message: err.message, err });
              } else {
                  res.status(200).json({ success: true, message: 'Correo enviado.' })
              }
          })

      })
      .catch(err => {
          console.log('ERROR: ', err.message || err);
          res.status(500).json({ success: false, message: err.message, err })
      })
}


sendSMS = (req, res) => {
  console.log('Test Mensaje de texto');
  let idAsistencia = req.body.idAsistencia;
  let idAlumno = req.body.idAlumno;
  const query = 'SELECT fn_telefono AS response FROM fn_telefono($1)';
  const queryAlumno = 'SELECT nombres,apellido_paterno FROM alumnos WHERE id_alumno = $1';
  const phone = new ps('phone', query, idAsistencia);
  db.one(phone)
    .then(data => {
      const alumno = new ps('alumno', queryAlumno, idAlumno);
      db.one(alumno)
        .then(result => {
          let msg = `Se le notifica que el alumno ${result.nombres} ${result.apellido_paterno} con código universitario ${idAlumno}, no se encuentra matriculado en su curso.`
          let datos = [];
          datos.push({
            phone_number: `${data.response}`,
            message: msg,
            device_id: '95035'
          })
          fetch('https://smsgateway.me/api/v4/message/send', {
            method: 'post',
            headers: { 'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhZG1pbiIsImlhdCI6MTUzMTk0NzcyMywiZXhwIjo0MTAyNDQ0ODAwLCJ1aWQiOjU1OTQzLCJyb2xlcyI6WyJST0xFX1VTRVIiXX0.UwmM173B1dDkD8NEUgPv3o_6PhQO27gDDlI026rn3qc' },
            body: JSON.stringify(datos)
          })
            .then(rep => rep.json())
            .then(rep => {
              if (rep.status == 'pending') {
                res.status(200).json({ success: true })
              } else {
                res.status(400).json({ success: false, message: 'No se pudo enviar mensaje' })
              }

            });
        })
        .catch(err => {
          res.status(400).json({ success: false, message: err.message, err });
          console.log('ERROR: ', err.message || err);
        })

    })
    .catch(err => {
      res.status(400).json({ success: false, message: err.message, err });
      console.log('ERROR: ', err.message || err);
    })
}
