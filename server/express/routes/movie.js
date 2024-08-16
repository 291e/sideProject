const express = require('express');
const passport = require('./authStrategy/passport');
const movieService = require('./service/movieService');
const router = express.Router();

router.get('/', async function (req, res) { 
    const boxOffice = await movieService.getToDayBoxoffice();
    for (const movie of boxOffice) {
        console.log(movie.title);
        console.log(movie.reprlsdate);
        movie_id = await movieService.getMovieId(movie.title, movie.reprlsdate);
        movie.movie_id = movie_id.movie_id;
        console.log(movie.movie_id);
        const poster = await movieService.getPoster(movie.movie_id);
        movie.poster = poster.poster_url;
    }
    res.status(200).json(boxOffice);
});

router.get('/:id', async function (req, res) {
    const id = req.params.id;
    const movie = await movieService.getMovie(id);
    const genres = await movieService.getGenres(id);
    const directors = await movieService.getDirectors(id);
    const actors = await movieService.getActors(id);
    const keywords = await movieService.getKeywords(id);
    const posters = await movieService.getPosters(id);
    console.log(movie);
    console.log(genres);
    console.log(directors);
    console.log(actors);
    console.log(keywords);
    res.status(200).json({movie, genres, directors, actors, keywords, posters});
});

router.post('/', passport.authenticate('jwt', { session: false }), async function (req, res) {

});

router.put('/:id', passport.authenticate('jwt', { session: false }), async function (req, res) {

});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async function (req, res) {

});

module.exports = router;