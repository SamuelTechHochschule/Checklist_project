const chai = require('chai');
const expect = chai.expect;
const db = require('../api/db.cjs');

describe('Datenbankverbindung', () => {
    it('Sollte erfolgreich hergestellt werden', async () =>{
        try{
            await db.connect();
            console.log('Datenbankverbindung erfolgreich hergestellt');
        } catch (error) {
            console.error('Fehler bei der Datenbankverbindung:', error.message);
            throw new Error('Die Datenbankverbindung konnte nicht hergestellt werden');
        }
    });
})