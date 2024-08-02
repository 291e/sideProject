require('dotenv').config();
const { Client } = require('pg');

class dbcon {
  constructor(){
    this.client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    this.connect();
    this.create();
  }
  async connect(){
    await this.client.connect();
  }
  async create(){
    await this.client.query('CREATE TABLE IF NOT EXISTS member (member_id SERIAL, name TEXT, id TEXT PRIMARY KEY, password TEXT)');
    await this.client.query('CREATE TABLE IF NOT EXISTS post (post_id SERIAL PRIMARY KEY, title TEXT, content TEXT, id TEXT REFERENCES member(id))');
    await this.client.query('INSERT INTO post (title, content, id) VALUES ($1, $2, $3)', ['title1', 'content1', 'jth0809@naver.com']);
  }
  async selectPosts(limit){
    //const result = await this.client.query('SELECT post_id, title, id FROM post ORDER BY post_id DESC LIMIT $1 OFFSET $2',limit);
    const result = await this.client.query('SELECT post_id, title, id FROM post ORDER BY post_id DESC');
    return result.rows;
  }
  async selectPost(id){
    const result = await this.client.query('SELECT title, content, id FROM post WHERE post_id = $1',[id]);
    return result.rows[0];
  }
  async insertPost(post){
    await this.client.query('INSERT INTO post (title, content, id) VALUES ($1, $2, $3)',post);
  }
  async updatePost(post){
    await this.client.query('UPDATE post SET title = $1, content = $2 WHERE post_id = $3',post);
  }
  async deletePost(id){
    await this.client.query('DELETE FROM post WHERE post_id = $1',[id]);
  }




  async insertMember(username, id, password){
    try {
      await this.begin();
      await this.client.query('INSERT INTO member (name, id, password) VALUES ($1, $2, $3)', [username, id, password]);
      await this.commit();
    }
    catch{
      await this.rollback();
    }
  }
 
  async selectMember(id){
    const result = await this.client.query('SELECT name FROM member WHERE id = $1',[id]);
    return result.rows[0];
  }
  
  async authMember(id){
    const result = await this.client.query('SELECT password FROM member WHERE id = $1',[id]);
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new Error('User not found');
    }
  }
  
  async updateMember(member){
    try {
      await this.begin();
      await this.client.query('UPDATE member SET name = $1, id = $2',member);
      await this.commit();
    }
    catch{
      await this.rollback();
    }
  }
  
  async deleteMember(id){
    await this.client.query('DELETE FROM member WHERE id = $1',[id]);
  }
  
  async begin(){
    await this.client.query('BEGIN');
  }
  async commit(){
    await this.client.query('COMMIT');
  }
  async rollback(){
    await this.client.query('ROLLBACK');
  }
  async end(){
    await this.client.end();
  }
}

module.exports = new dbcon;
