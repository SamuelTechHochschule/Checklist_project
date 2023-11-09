const pgp = require('pg-promise')();
const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD} = process.env;

//Variablen von process.env 
const db = pgp({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
});

//Verbindungstest
db.connect()
    .then(obj => {
        obj.done();
        console.log('Datenbankverbindung erfolgreich hergestellt');
    })
    .catch(error => {
        console.error('Fehler bei der Datenbankverbindung:', error.message, process.env.DB);
        process.exit(1);
    });

module.exports = db;