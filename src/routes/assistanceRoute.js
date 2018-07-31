const express = require('express');
const router = express.Router();
const {setAssistance,docenteAsistencia,createAssistance,getCourses,getTeachers,getAsistencias,getAlumnos,getTodayAssistance,offAssistance,finalizarAsistencia} = require('../controllers/assistanceController');

router.post('/asistencias/ingresar',setAssistance);
router.post('/asistencia/ingresar/docente',docenteAsistencia);
router.post('/asistencia/offline',offAssistance);
router.post('/asistencia/crear',createAssistance);
router.post('/asistencias/finalizar',finalizarAsistencia);
router.get('/asistencia/cursos/:idTeacher',getCourses);
router.get('/asistencia/profesores',getTeachers);
router.get('/asistencia/:idHorario',getAsistencias);
router.get('/asistencia/alumnos/:idAsistencia',getAlumnos);
router.get('/asistencia',getTodayAssistance);
module.exports = router;