require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

class db {
  async connect(){
    await client.connect();
  }
  async create(){
    await client.query('CREATE TABLE IF NOT EXISTS member (member_id SERIAL, name TEXT, id TEXT PRIMARY KEY, password TEXT)');
  }
  async insertMember(username, id, password){
    await client.query('INSERT INTO member (name, id, password) VALUES ($1, $2, $3)', [username, id, password]);
  }
  async selectMember(id){
    const result = await client.query('SELECT password FROM member WHERE id = $1',[id]);
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new Error('User not found');
    }
  }
  async begin(){
    await client.query('BEGIN');
  }
  async commit(){
    await client.query('COMMIT');
  }
  async rollback(){
    await client.query('ROLLBACK');
  }
  async end(){
    await client.end();
  }
}

module.exports = db;
