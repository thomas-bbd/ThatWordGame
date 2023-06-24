import sqlite3 from 'sqlite3';

let db = new sqlite3.Database('../var/db/sessions.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the sessions database.');
  });

  db.serialize(() => {
    db.each(`SELECT * from sessions`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row.id + "\t" + row.name);
    });
  });
  
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });