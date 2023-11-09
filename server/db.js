const pgp = require('pg-promise')();
const { init } = require('pg-promise-transaction');

require('dotenv').config();

const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD,} = process.env;

const connectionOptions = {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
};

const pgpConfig = pgp({ capSQL: true });
const pgpWithTransaction = init(pgpConfig);

const db = pgpWithTransaction(connectionOptions);

db.connect()
    .then((obj) => {
        console.log('Datenbankverbindung erfolgreich hergestellt');
        obj.done();
    })
    .catch ((error) => {
        console.error('Fehler bei der Datenbankverbindung: ', error);
        process.exit(1);
    })
    

module.exports = db;