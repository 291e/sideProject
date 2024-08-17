const express = require('express');
const passport = require('./authStrategy/passport');
const movieService = require('./service/movieService');
const router = express.Router();

router.get('/', async function (req, res) { 
    try{
        const boxOffice = await movieService.getToDayBoxoffice();
        for (const movie of boxOffice) {
            movie_id = await movieService.getMovieId(movie.title, movie.reprlsdate);
            movie.movie_id = movie_id.movie_id;
            const poster = await movieService.getPoster(movie.movie_id);
            movie.poster = poster.poster_url;
        }
        res.status(200).json(boxOffice);
    }catch(err){
        res.status(500).json({message: "Failed to get box office information."});
    }
});

router.get('/:id', async function (req, res) {
    const id = req.params.id;
    try{
        const movie = await movieService.getMovie(id);
        const genres = await movieService.getGenres(id);
        const directors = await movieService.getDirectors(id);
        const actors = await movieService.getActors(id);
        const keywords = await movieService.getKeywords(id);
        const posters = await movieService.getPosters(id);
        res.status(200).json({movie, genres, directors, actors, keywords, posters});
    }catch(err){
        res.status(404).json({message: "영화 정보를 찾을 수 없습니다."});
    }
});

router.get('/review/:movie_id', async function (req, res) {
    const movie_id = req.params.movie_id;
    try{
        const reviews = await movieService.getReviews(movie_id);
        res.status(200).json(reviews);
    }catch(err){
        res.status(404).json({message: "리뷰 정보를 찾을 수 없습니다."});
    }
});

router.post('/review/:movie_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
    const movie_id = req.params.movie_id;
    const user_id = req.user.id;
    console.log(user_id);
    const {rating, review = ''} = req.body;
    if (rating < 0 || rating > 5) {
        res.status(400).json({message: "평점은 0점부터 5점까지 입력 가능합니다."});
    }
    try{
        await movieService.reviewCreate([movie_id, user_id, rating, review]);
        res.status(200).json({message: 'Create Success'});
    }catch(err){
        res.status(500).json({message: 'Create Failed'});
    }
});

router.put('/review/:review_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
    const review_id = req.params.review_id;
    const user_id = req.user.id;
    const {rating, review = ''} = req.body;
    if (rating < 0 || rating > 5) {
        res.status(400).json({message: "평점은 0점부터 5점까지 입력 가능합니다."});
    }
    try{
        await movieService.reviewUpdate([review_id, user_id, rating, review]);
        res.status(200).json({message:'Update Success'});
    }catch(err){
        res.status(500).json({message: 'Update Failed'});
    }
});

router.delete('/review:review_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
    const review_id = req.params.review_id;
    const user_id = req.user.id;
    try{
        await movieService.reviewDelete([review_id, user_id]);
        res.status(200).json({message: 'Delete Success'});
    }catch(err){
        res.status(500).json({message: 'Delete Failed'});
    }
});

module.exports = router;