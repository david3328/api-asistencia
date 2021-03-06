const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const assistanceRouter = require('./routes/assistanceRoute');
const teacherRouter = require('./routes/teacherRoute');
const studentRouter = require('./routes/studentRoute');
const courseRouter = require('./routes/courseRoute');
const guideRouter = require('./routes/guideRoute');

//Settings
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.set('port', process.env.PORT || 4000);

//Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());

//Routes
app.use('/api',assistanceRouter);
app.use('/api',teacherRouter);
app.use('/api',studentRouter);
app.use('/api',courseRouter);
app.use('/api',guideRouter);

//Sockets

//Listen server
app.listen(app.get('port'),()=>{
  console.log(`Server run on port ${app.get('port')}`);
});