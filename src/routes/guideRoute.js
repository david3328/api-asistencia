const express = require('express');
const router = express.Router();

const {getGroups,getSemestres,setGuide,getGuides,getCourses,getHours,setHour,getStudents,setMatricula} = require('../controllers/guideController');

router.get('/guia/grupos',getGroups);
router.get('/guia/semestres',getSemestres);
router.get('/guia/cursos',getCourses);
router.get('/guia/horarios',getHours);
router.get('/guia/alumnos/:idGuia',getStudents);
router.post('/guia',setGuide);
router.post('/guia/horario',setHour);
router.post('/guia/matricula',setMatricula);
router.get('/guia',getGuides);

module.exports = router;
