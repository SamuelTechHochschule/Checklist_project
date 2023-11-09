const pgp = require('pg-promise')();

//Variablen von process.env 
const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

//Verbindungstest
db.connect()
    .then(obj => {
        obj.done();
        console.log('Datenbankverbindung erfolgreich hergestellt');
    })
    .catch(error => {
        console.error('Fehler bei der Datenbankverbindung:', error.message);
        process.exit(1);
    });

module.exports = db;