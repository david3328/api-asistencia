const express = require('express');
const router = express.Router();
const {setDocente,getDocente,datosDocente} = require('../controllers/teacherController');

router.post('/docente',setDocente);
router.get('/docente',getDocente);
router.get('/docente/email/:email',datosDocente)
module.exports = router;