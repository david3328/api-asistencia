const express = require('express');
const router = express.Router();
const {setAssistance,createAssistance} = require('../controllers/assistanceController');

router.post('/asistencia/ingresar',setAssistance);
router.post('/asistencia/crear',createAssistance);

module.exports = router;