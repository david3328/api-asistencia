const express = require('express');
const router = express.Router();
const {setAssistance,createAssistance,getCourses,getTeachers,getAsistencias,getAlumnos} = require('../controllers/assistanceController');

router.post('/asistencia/ingresar',setAssistance);
router.post('/asistencia/crear',createAssistance);
router.get('/asistencia/cursos/:idTeacher',getCourses);
router.get('/asistencia/profesores',getTeachers);
router.get('/asistencia/:idHorario',getAsistencias);
router.get('/asistencia/alumnos/:idAsistencia',getAlumnos);
module.exports = router;