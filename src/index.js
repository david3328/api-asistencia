const express = require('express');
const app = express();

const assistanceRouter = require('./routes/assistanceRoute');

//Settings
app.set('port', process.env.PORT || 3000);

//Middleware
app.use(express.json());

//Routes
app.use('/api',assistanceRouter);

//Sockets

//Listen server
app.listen(app.get('port'),()=>{
  console.log(`Server run on port ${app.get('port')}`);
});