const express = require('express');
const router = express.Router();
const {getAlumnos,setAlumno,getAlumno} = require('../controllers/studentController');

router.get('/alumno',getAlumnos);
router.get('/alumno/:idalumno',getAlumno);
router.post('/alumno',setAlumno);

module.exports = router;