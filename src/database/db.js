const pgp = require('pg-promise')();
const con = 'postgres://postgres:t2ysfu5exzxw@localhost:5432/asistencia';

const db = pgp(con);

module.exports = db;