const { expect } = require('chai');
const db = require('../server/db.cjs');

describe('Datenbankverbindung', () => {
    it('Sollte eine erfolgreiche Verbindung zur Datenbank herstellen', async () => {
        const connection = await db.connect();
        expect(connection).to.be.an('object');
        connection.done();
    });

    it('Sollte auf einen Fehler bei ungültigen Verbindungsdaten reagieren', async () => {
        process.env.DB_USER = 'Unknown';
        process.env.DB_PASSWORD = 'Wrong_password';

        await expect(db.connect()).to.be.rejected;

        process.env.DB_USER = 'postgres';
        process.env.DB_PASSWORD = 'postgres';
    });
});