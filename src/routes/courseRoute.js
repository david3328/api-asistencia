const express = require('express');
const router = express.Router();
const {setCurso,getCursos} = require('../controllers/courseController');

router.post('/curso',setCurso);
router.get('/curso',getCursos);

module.exports = router;
