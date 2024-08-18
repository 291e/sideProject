const express = require('express');
const passport = require('./authStrategy/passport');
const movieService = require('./service/movieService');
const router = express.Router();
/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get Box Office
 *     description: Get Box Office
 *     tags: 
 *       - movie
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movie_id:
 *                   type: string
 *                   example: "12345"
 *                 title:
 *                   type: string
 *                   example: "극한직업"
 *                 repRlsDate:
 *                   type: string
 *                   example: "20190123"
 *                 audi:
 *                   type: string
 *                   example: "1000000"
 *                 sales:
 *                   type: string
 *                   example: "1000000"
 *                 rank:
 *                   type: string
 *                   example: "1"
 *                 rankInten:
 *                   type: string
 *                   example: "1"
 *                 rankOldAndNew:
 *                   type: string
 *                   example: "NEW"
 *       500:
 *         description: Failed to add movie information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to add movie information."
 */
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

/**
 * @swagger
 * /api/movies/{movieId}:
 *   get:
 *     summary: Get Movie
 *     description: Get Movie
 *     parameters:
 *      - name: movieId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - movie
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movie:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "제목..."
 *                     repRlsDate:
 *                       type: string
 *                       example: "20190123"
 *                     rating:
 *                       type: string
 *                       example: "1"
 *                     plot:
 *                       type: string
 *                       example: "줄거리..."
 *                     runtime:
 *                       type: string
 *                       example: "120"
 *                     company:
 *                       type: string
 *                       example: "회사명..."
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       genre_name:
 *                         type: string
 *                         example: "액션"
 *                 directors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       director_name:
 *                         type: string
 *                         example: "홍길동"
 *                 actors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       actor_name:
 *                         type: string
 *                         example: "홍길동"
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       keyword_name:
 *                         type: string
 *                         example: "경찰"
 *                 posters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       poster_url:
 *                         type: string
 *                         example: "http://.....jpg"
 *       404:
 *         description: 영화 정보를 찾을 수 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "영화 정보를 찾을 수 없습니다."
 */
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


/**
 * @swagger
 * /api/movies/review/{movieId}:
 *   get:
 *     summary: Get Review
 *     description: Get Review
 *     parameters:
 *      - name: movieId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - review
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   review_id:
 *                     type: string
 *                     example: "1"
 *                   member_id:
 *                     type: string
 *                     example: "abcd1234@abcd.com"
 *                   rating:
 *                     type: string
 *                     example: 5
 *                   review:
 *                     type: string
 *                     example: "리뷰내용..."
 *       404:
 *         description: "NOT FOUND"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "리뷰 정보를 찾을 수 없습니다."
 */
router.get('/review/:movie_id', async function (req, res) {
    const movie_id = req.params.movie_id;
    try{
        const reviews = await movieService.getReviews(movie_id);
        res.status(200).json(reviews);
    }catch(err){
        res.status(404).json({message: "리뷰 정보를 찾을 수 없습니다."});
    }
});
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /api/movies/review/{movieId}:
 *   post:
 *     summary: Create Review
 *     description: Create review
 *     parameters:
 *      - name: movieId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - review
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       description: rating, review
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: string
 *                 example: "5"
 *               review:
 *                 type: string
 *                 example: "리뷰내용"
 *             required:
 *               - rating
 *               - review
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 type: object
 *                 message:
 *                   type: string
 *                   example: "Create Success"
 *       500:
 *         description: "Create Failed"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Create Failed"
 */
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
/**
 * @swagger
 * /api/movies/review/{reviewId}:
 *   put:
 *     summary: Update Review
 *     description: Update Review
 *     parameters:
 *      - name: reviewId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - review
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       description: rating, review
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: string
 *                 example: "5"
 *               review:
 *                 type: string
 *                 example: "리뷰내용"
 *             required:
 *               - rating
 *               - review
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 type: object
 *                 message:
 *                   type: string
 *                   example: "Update Success"
 *       500:
 *         description: "Update Failed"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update Failed"
 */
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
/**
 * @swagger
 * /api/movies/review/{reviewId}:
 *   delete:
 *     summary: Delete Review
 *     description: Delete Review
 *     parameters:
 *      - name: reviewId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - review
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type: object
 *                 message:
 *                   type: string
 *                   example: "Delete Success"
 *       500:
 *         description: "Delete Failed"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delete Failed"
 */
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