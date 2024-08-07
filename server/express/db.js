require('dotenv').config();
import { Pool } from 'pg';

class dbcon {
  constructor(){
    this.client = new Pool({
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
    await this.client.query('CREATE TABLE IF NOT EXISTS comment (comment_id SERIAL PRIMARY KEY, comment TEXT, post_id INT REFERENCES post(post_id), id TEXT REFERENCES member(id))');
    await this.client.query('CREATE TABLE IF NOT EXISTS like (post_id INT REFERENCES post(post_id), id TEXT REFERENCES member(id), PRIMARY KEY(post_id, id))');
    await this.client.query('CREATE TABLE IF NOT EXISTS follow (follow_id SERIAL PRIMARY KEY, follower TEXT REFERENCES member(id), following TEXT REFERENCES member(id))');
    //await this.client.query('CREATE TABLE IF NOT EXISTS movie (movie_id SERIAL PRIMARY KEY, title TEXT, director TEXT, year INT, rating INT)');
  }

  async selectPosts(limit){
    //const result = await this.client.query('SELECT post_id, title, id FROM post ORDER BY post_id DESC LIMIT $1 OFFSET $2',limit);
    const result = await this.client.query('SELECT post_id, title, id FROM post ORDER BY post_id DESC');
    return result.rows;
  }
  async selectPost(post_id){
    const result = await this.client.query('SELECT title, content, id FROM post WHERE post_id = $1',[post_id]);
    return result.rows[0];
  }
  async insertPost(post){
    try {
      await this.begin();
      await this.client.query('INSERT INTO post (title, content, id) VALUES ($1, $2, $3)',post);
      await this.commit();
    }
    catch{
      await this.rollback();
    }
  }
  async updatePost(post){
    await this.client.query('UPDATE post SET title = $1, content = $2 WHERE post_id = $3 AND id = $4',post);
  }
  async deletePost(post_id, id){
    await this.client.query('DELETE FROM post WHERE post_id = $1 AND id = $2',[post_id, id]);
  }


  async selectComments(post_id){
    const result = await this.client.query('SELECT comment_id, comment, id FROM comment WHERE post_id = $1',[post_id]);
    return result.rows;
  }
  async insertComment(comment, post_id, user_id){
    await this.client.query('INSERT INTO comment (comment, post_id, id) VALUES ($1, $2, $3)',[comment, post_id, user_id]);
  }
  async updateComment(comment, comment_id, user_id){
    await this.client.query('UPDATE comment SET comment = $1 WHERE comment_id = $2, id = $3',[comment, comment_id, user_id]);
  }
  async deleteComment(comment_id, user_id){
    await this.client.query('DELETE FROM comment WHERE comment_id = $1, id = $2',[comment_id, user_id]);
  }


  async selectLikes(post_id){
    const result = await this.client.query('SELECT COUNT(post_id) FROM like WHERE post_id = $1',[post_id]);
    return result.rows[0];
  }
  async selectLike(post_id, user_id){
    const result = await this.client.query('SELECT like_id FROM like WHERE post_id = $1 AND id = $2',[post_id, user_id]);
    return result.rows[0];
  }
  async insertLike(post_id, user_id){
    await this.client.query('INSERT INTO like (post_id, id) VALUES ($1, $2)',[post_id, user_id]);
  }
  async deleteLike(like_id, user_id){
    await this.client.query('DELETE FROM like WHERE like_id = $1 AND id = $2',[like_id, user_id]);
  }


  async selectFollowers(user_id){
    const result = await this.client.query('SELECT following FROM follow WHERE follower = $1',[user_id]);
    return result.rows;
  }
  async selectFollowings(user_id){
    const result = await this.client.query('SELECT follower FROM follow WHERE following = $1',[user_id]);
    return result.rows;
  }
  async insertFollow(follower_id, following_id){
    await this.client.query('INSERT INTO follow (follower, following) VALUES ($1, $2)',[follower_id, following_id]);
  }
  async deleteFollow(follower_id, following_id){
    await this.client.query('DELETE FROM follow WHERE follower = $1 AND following = $2',[follower_id, following_id]);
  }
  async isFollowing(following_id, follower_id){
    const result = await this.client.query('SELECT 1 FROM follow WHERE following = $1 AND follower = $2',[following_id, follower_id]);
    return result.rows[0];
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
  async updateMember(member, auth_id){
    try {
      await this.begin();
      await this.client.query('UPDATE member SET name = $1, id = $2', [member, auth_id]);
      await this.commit();
    }
    catch{
      await this.rollback();
    }
  }
  async deleteMember(auth_id){
    await this.client.query('DELETE FROM member WHERE id = $1',[auth_id]);
  }
  async authMember(id){
    const result = await this.client.query('SELECT password FROM member WHERE id = $1',[id]);
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new Error('User not found');
    }
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

export default new dbcon;
