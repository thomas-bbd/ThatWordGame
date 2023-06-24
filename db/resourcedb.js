import { Connection, Request } from "tedious";
import { config } from "dotenv";

config();

// const dbConfig = JSON.parse(process.env.DATABASE_CONFIG);

const dbConfig = {
    server: process.env.RDS_HOSTNAME,
    authentication: {
        type: "default",
        options: {
            userName: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD
        }
    },
    options: {
        database: "ResourceServerDB",
        encrypt: true,
        port: parseInt(process.env.RDS_PORT),
        trustServerCertificate: true
    }
}
console.log(`The hostname was: ${process.env.RDS_HOSTNAME}, the port was: ${process.env.RDS_PORT}, the username was: ${process.env.RDS_USERNAME}, the password was: ${process.env.RDS_PASSWORD}`);

const execSQLRequest = (sql, params) =>  
  new Promise((resolve, reject) => {

    const connection = new Connection(dbConfig);
    let result = [];
    const request = new Request(sql, (err, rowCount) => {

      if (err){
        console.log(`request rejection. Name: ${err.name}. Message ${err.message || err}. Error object: ${err}`);
        DEBUG("DB Rejection:", {
            name: err.name,
            message: err.message || err,
        });
        reject(err);
      }
      else
        resolve(result);

      connection.close();
    });

    params?.forEach(p => {
      request.addParameter(p.name, p.type, p.value);
    });;

    request.on('row', columns => {
      let record = new Map();
      columns.forEach(column => {
        record.set(column.metadata.colName, column.value);
    });

    if (record.size > 0){
        result.push(record);
    } 
  });
  
    connection.on("connect", (err) => {
      if (err){
        console.log(`connection rejection. Name: ${err.name}. Message ${err.message || err}. Error object: ${err}`);
        DEBUG("DB Connection rejection:", {
            name: err.name,
            message: err.message || err,
        });
        reject(err);
      }
      else
        connection.execSql(request);
    });
    connection.connect();
  });
  
  export default execSQLRequest;