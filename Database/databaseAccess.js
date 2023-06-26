//const sql = require('mssql');
import sql from 'mssql';
import bcrypt from 'bcrypt';
import { config } from "dotenv";

config();

// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PWD,
//   server: process.env.DATABASE_SERVER,
//   database: process.env.DATABASE,
//   options: {
//     trustedConnection: true,
//     enableArithAbort: true,
//     trustServerCertificate: true
//   },
//   port: 53803
// };

// const sqlconfig = {
//   userName: process.env.RDS_USERNAME,
//   password: process.env.RDS_PASSWORD,
//   server: process.env.RDS_HOSTNAME,
//   database: process.env.DATABASE,
//   options: {
//     trustedConnection: true,
//     enableArithAbort: true,
//     trustServerCertificate: true
//   },
//   port: 53803
// };

const sqlconfig = {
  server: process.env.RDS_HOSTNAME,
  authentication: {
      type: "default",
      options: {
          userName: process.env.RDS_USERNAME,
          password: process.env.RDS_PASSWORD
      }
  },
  options: {
      database: "IdentityDB",
      encrypt: true,
      port: parseInt(process.env.RDS_PORT),
      trustServerCertificate: true
  }
}

console.log(`The hostname was: ${process.env.RDS_HOSTNAME}, the port was: ${process.env.RDS_PORT}, the username was: ${process.env.RDS_USERNAME}, the password was: ${process.env.RDS_PASSWORD}`);


async function FetchUsers() {
  try{
    let pool = await sql.connect(sqlconfig);
    console.log('server is connected...');
    const query = 'SELECT * FROM dbo.USERS';
    let request = await pool.request().query(query);
    return request.recordset;
  }catch(error){
    console.log(error);
  }
}

async function InsertUser(username, password, email){
  const hashedPassword =  await EncryptPassword(password);
  try{
    let pool = await sql.connect(sqlconfig);
    let result = await pool.request()
    .input('username', sql.VarChar, username)
    .input('password', sql.VarChar,hashedPassword)
    .input('email', sql.VarChar,email)
    .query('INSERT INTO USERS(username, password, email) VALUES (@username, @password, @email)');
    return result.recordset;
  }catch(error){
    return error;
  }
}

async function GetUserByUsernameEmail(username, email){
  try {
      let pool = await sql.connect(sqlconfig);
      let result = await pool
          .request()
          .input('username', sql.VarChar, username)
          .input('email', sql.VarChar, email)
          .query('SELECT u.id, u.username, u.email, u.password FROM dbo.USERS u WHERE u.username = @username AND u.email = @email');
      return result.recordset;
  } catch (error) {
      return error;
  }
}

async function EncryptPassword(password) {
  try {
      //Add new encryption here
      let saltbae = await bcrypt.genSalt();
      let hashbrown = await bcrypt.hash(password, saltbae);
      let hashedPassword = hashbrown;
      return hashedPassword;
  } catch (error) {
      throw error;
  }
}


export {FetchUsers, InsertUser, GetUserByUsernameEmail};