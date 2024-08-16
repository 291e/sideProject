require('dotenv').config();
const { Pool } = require('pg');

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
  }
  async connect(){
    await this.client.connect();
    const movieApiCaller = require('./routes/dbUpdate/movieApiCaller');
    console.log('DB connected');
    //await movieApiCaller.movieApiCaller();
    //movieApiCaller.movieBoxOfficeCaller();
  }

  async selectMovie(movie_id){
    const result = await this.client.query('SELECT title, repRlsDate, rating, plot, runtime, company FROM movie WHERE movie_id = $1',[movie_id]);
    return result.rows[0];
  }
  async selectGenres(movie_id){
    const result = await this.client.query('SELECT genre_name FROM genre WHERE genre_name IN (SELECT genre_id  FROM movieGenre WHERE movie_id = $1)',[movie_id]);
    return result.rows;
  }
  async selectDirectors(movie_id){
    const result = await this.client.query('SELECT director_name FROM director WHERE director_id IN (SELECT director_id FROM movieDirector WHERE movie_id = $1)',[movie_id]);
    return result.rows;
  }
  async selectActors(movie_id){
    const result = await this.client.query('SELECT actor_name FROM actor WHERE actor_id IN (SELECT actor_id FROM movieActor WHERE movie_id = $1)',[movie_id]);
    return result.rows;
  }
  async selectKeywords(movie_id){
    const result = await this.client.query('SELECT keyword_name FROM keyword WHERE keyword_name IN (SELECT keyword_id FROM movieKeyword WHERE movie_id = $1)',[movie_id]);
    return result.rows;
  }
  async selectPosters(movie_id){
    const result = await this.client.query('SELECT poster_url FROM poster WHERE movie_id = $1',[movie_id]);
    return result.rows;
  }

  async selectToDayBoxOffice(date){
    const result = await this.client.query('SELECT movie_id, title, repRlsDate, audi, sales, rank, rankInten, rankOldAndNew FROM boxoffice WHERE BoxOffice_DATE = $1',[date]);
    return result.rows;
  }
  async selectPoster(movie_id){
    const result = await this.client.query('SELECT poster_url FROM poster WHERE movie_id = $1',[movie_id]);
    return result.rows[0];
  }

  async selectMovieTitleAndProdYear(title, reprlsdate){
    const searchTitle = ` ${title}`;
    const result = await this.client.query('SELECT movie_id FROM movie WHERE title LIKE $1 AND repRlsDate = $2',[searchTitle, reprlsdate]);
    return result.rows[0];
  }

  async insertBoxOffice(boxOffice){
    try {
      await this.begin();
      await this.client.query('INSERT INTO boxoffice (movie_id, title, repRlsDate, audi, sales, rank, rankInten, rankOldAndNew) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',boxOffice);
      await this.commit();
    }
    catch{
      await this.rollback();
    }
  }


  async insertMovie(movie){
    try {
      await this.begin();
      await this.client.query('INSERT INTO movie (movie_id, title, repRlsDate, rating, plot, runtime, company) VALUES ($1, $2, $3, $4, $5, $6, $7)',movie);
      await this.commit();
    }
    catch{
      await this.rollback();
    }
  }
  async insertGenre(genre){
    await this.client.query('INSERT INTO genre (genre_name) VALUES ($1) ON CONFLICT DO NOTHING',genre);
  }
  async insertDirector(director){
    await this.client.query('INSERT INTO director (director_id, director_name) VALUES ($1, $2) ON CONFLICT DO NOTHING',director);
  }
  async insertActor(actor){
    await this.client.query('INSERT INTO actor (actor_id, actor_name) VALUES ($1, $2) ON CONFLICT DO NOTHING',actor);
  }
  async insertPoster(poster){
    await this.client.query('INSERT INTO poster (movie_id, poster_url) VALUES ($1, $2) ON CONFLICT DO NOTHING',poster);
  }
  async insertKeyword(keyword){
    await this.client.query('INSERT INTO keyword (keyword_name) VALUES ($1) ON CONFLICT DO NOTHING',keyword);
  }

  async insertMovieGenre(MovieGenre){
    await this.client.query('INSERT INTO movieGenre (movie_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',MovieGenre);
  }
  async insertMovieDirector(MovieDirector){
    await this.client.query('INSERT INTO movieDirector (movie_id, director_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',MovieDirector);
  }
  async insertMovieActor(MovieActor){
    await this.client.query('INSERT INTO movieActor (movie_id, actor_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',MovieActor);
  }
  async insertMovieKeyword(MovieKeyword){
    await this.client.query('INSERT INTO movieKeyword (movie_id, keyword_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',MovieKeyword);
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
    const result = await this.client.query('SELECT COUNT(post_id) FROM likepoint WHERE post_id = $1',[post_id]);
    return result.rows[0];
  }
  async selectLike(post_id, user_id){
    const result = await this.client.query('SELECT like_id FROM likepoint WHERE post_id = $1 AND id = $2',[post_id, user_id]);
    return result.rows[0];
  }
  async insertLike(post_id, user_id){
    await this.client.query('INSERT INTO likepoint (post_id, id) VALUES ($1, $2)',[post_id, user_id]);
  }
  async deleteLike(like_id, user_id){
    await this.client.query('DELETE FROM likepoint WHERE like_id = $1 AND id = $2',[like_id, user_id]);
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

module.exports = new dbcon;
