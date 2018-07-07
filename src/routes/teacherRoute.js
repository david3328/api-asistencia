const express = require('express');
const router = express.Router();
const {setDocente,getDocente} = require('../controllers/teacherController');

router.post('/docente',setDocente);
router.get('/docente',getDocente);

module.exports = router;