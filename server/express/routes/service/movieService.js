const db = require('../../db');

class movieService{
    async getToDayBoxoffice(){
        const date = new Date();
        date.setDate(date.getDate()-1);
        const Today = date.toISOString().split('T')[0];
        console.log(Today);
        return await db.selectToDayBoxOffice(Today);
    }
    async getPoster(movie_id){
        return await db.selectPoster(movie_id);
    }
    async getMovieId(title, reprlsdate){
        console.log(title, reprlsdate.replace(/-/g, ''));
        return await db.selectMovieTitleAndProdYear(title, reprlsdate.replace(/-/g, ''));
    }
    async getMovie(id){
        return await db.selectMovie(id);
    }
    async getGenres(movie_id){
        return await db.selectGenres(movie_id);
    }
    async getDirectors(movie_id){
        return await db.selectDirectors(movie_id);
    }
    async getActors(movie_id){
        return await db.selectActors(movie_id);
    }
    async getKeywords(movie_id){
        return await db.selectKeywords(movie_id);
    }
    async getPosters(movie_id){
        return await db.selectPosters(movie_id);
    }
}
module.exports = new movieService;