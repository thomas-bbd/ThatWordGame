//const sql = require('mssql');
import sql from 'mssql';
import bcrypt from 'bcrypt';
import "dotenv/config.js";
//require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE,
  options: {
    trustedConnection: true,
    enableArithAbort: true,
    trustServerCertificate: true
  },
  port: 53803
};

async function FetchUsers() {
  try{
    let pool = await sql.connect(config);
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
    let pool = await sql.connect(config);
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
      let pool = await sql.connect(config);
      let result = await pool
          .request()
          .input('username', sql.VarChar, username)
          .input('email', sql.VarChar, email)
          .query('SELECT u.username, u.email, u.password FROM dbo.USERS u WHERE u.username = @username AND u.email = @email');
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

console.log(FetchUsers());



export {FetchUsers, InsertUser, GetUserByUsernameEmail};