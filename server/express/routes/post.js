const express = require('express');
const passport = require('./authStrategy/passport');
const postService = require('./service/postService');
const router = express.Router();
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get Posts
 *     description: Get Posts
 *     tags: 
 *      - post
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   posts:
 *                     type: object
 *                     properties:
 *                       post_id:
 *                         type: string
 *                         example: "100..."
 *                       title:
 *                         type: string
 *                         example: "제목..."
 *                       id:
 *                         type: string
 *                         example: "작성자..."
 *       500:
 *         description: GET Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "GET Failed."
 */
router.get('/', async function (req, res) {
    //const limit = req.query.limit;
    try{
        const posts = await postService.getPosts();
        res.status(200).json({ posts });
    }
    catch(err){
        res.status(500).json({ message: err.message});
    }
});
/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get post
 *     description: Get post
 *     parameters:
 *      - name: postId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - post
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: A post object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "제목..."
 *                     content:
 *                       type: string
 *                       example: "내용..."
 *                     id:
 *                       type: string
 *                       example: "작성자..."
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       comment_id:
 *                         type: string
 *                         example: "100"
 *                       comment:
 *                         type: string
 *                         example: "내용..."
 *                       id:
 *                         type: string
 *                         example: "작성자..."
 *                 likes:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 10
 *                 like:
 *                   type: object
 *                   properties:
 *                     like_id:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: Failed to get box office information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to get box office information."
 */
router.get('/:post_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
    const { post_id = '' } = req.params;
    try{
      const post = await postService.getPost(post_id);
      const comments = await postService.getComments(post_id);
      const likes = await postService.getLikes(post_id);
      const like = await postService.getLike(post_id, req.user.id);
      res.status(200).json({ post, comments, likes, like });
    }
    catch(err){
      res.status(500).json({ message: err.message });
    }
});
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create Post
 *     description: Create Post
 *     tags: 
 *      - post
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       description: title, content
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "제목..."
 *               content:
 *                 type: string
 *                 example: "내용..."
 *             required:
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: 성공 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   example: "Create Success"
 *       500:
 *         description: Create Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Create Failed."
 */
router.post('/', passport.authenticate('jwt', { session: false }), async function (req, res) {
    const { title = '', content = '' } = req.body;
    const id = req.user.id;
    const name = req.user.name;
    console.log(name);
    try{
      await postService.postCreate([title, content, id, name]);
      res.status(200).json({ message: 'Create Success' });
    }
    catch{
      res.status(500).json({ message: 'Create Failed' });
    }
});
/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Update Post
 *     description: Update Post
 *     parameters:
 *      - name: postId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - post
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       description: title, content
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "제목..."
 *               content:
 *                 type: string
 *                 example: "내용..."
 *             required:
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: 성공 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   example: "Update Success"
 *       500:
 *         description: Update Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update Failed."
 */
router.put('/:post_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
    const { title = '', content = '' } = req.body;
    const { post_id = '' } = req.params;
    const { user_id = '' } = req.user.id;
    try{
      await postService.postUpdate([title, content, post_id, user_id]);
      res.status(200).json({ message: 'Update Success' });
    }
    catch{
      res.status(500).json({ message: 'Update Failed' });
    }
});
/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Update Post
 *     description: Update Post
 *     parameters:
 *      - name: postId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - post
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: 성공 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   example: "Delete Success"
 *       500:
 *         description: Delete Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delete Failed."
 */
router.delete('/:post_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
    const { post_id = '' } = req.params;
    const { user_id = '' } = req.user.id;
    try{
      await postService.postDelete(post_id, user_id);
      res.status(200).json({ message: 'Delete Success' });
    }
    catch{
      res.status(500).json({ message: 'Delete Failed' });
    }
});



/**
 * @swagger
 * /api/like/{postId}:
 *   post:
 *     summary: Like Post
 *     description: Like Post
 *     parameters:
 *      - name: postId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - like
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: 성공 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   example: "Like Success"
 *       500:
 *         description: Like Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Like Failed."
 */
router.post('/like/:post_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const { post_id = '' } = req.params;
  const { user_id = '' } = req.user.id;
  try{
    await postService.likeCreate(post_id, user_id);
    res.status(200).json({ message: 'Like Success' });
  }
  catch{
    res.status(500).json({ message: 'Like Failed' });
  }
});
/**
 * @swagger
 * /api/like/{likeId}:
 *   delete:
 *     summary: Delete Like
 *     description: Delete Like
 *     parameters:
 *      - name: likeId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - like
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: 성공 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   example: "Like Delete Success"
 *       500:
 *         description: Like Delete Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Like Delete Failed."
 */
router.delete('/like/:like_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const { like_id = '' } = req.params;
  const { user_id = '' } = req.user.id;
  try{
    await postService.likeDelete(like_id, user_id);
    res.status(200).json({ message: 'Like Delete Success' });
  }
  catch{
    res.status(500).json({ message: 'Like Delete Failed' });
  }
});



/**
 * @swagger
 * /api/comment/{postId}:
 *   post:
 *     summary: Create Comment
 *     description: Create Comment
 *     parameters:
 *      - name: postId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - comment
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       description: comment
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "내용..."
 *             required:
 *               - comment
 *     responses:
 *       200:
 *         description: 성공 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: object
 *                   example: "Comment Create Success."
 *       500:
 *         description: Comment Create Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment Create Failed."
 */
router.post('/comment/:post_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const { post_id = '' } = req.params;
  const { user_id = '' } = req.user.id;
  const { comment = '' } = req.body;
  try{
    await postService.commentCreate(comment, post_id, user_id);
    res.status(200).json({ message: 'Comment Create Success' });
  }
  catch{
    res.status(500).json({ message: 'Comment Create Failed' });
  }
});
/**
 * @swagger
 * /api/comment/{commentId}:
 *   put:
 *     summary: Update Comment
 *     description: Update Comment
 *     parameters:
 *      - name: commentId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - comment
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       description: comment
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "내용..."
 *             required:
 *               - comment
 *     responses:
 *       200:
 *         description: 성공 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   example: "Comment Update Success."
 *       500:
 *         description: Comment Update Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment Update Failed."
 */
router.put('/comment/:comment_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const { comment = '' } = req.body;
  const { comment_id = '' } = req.params;
  const { user_id = '' } = req.user.id;
  try{
    await postService.commentUpdate(comment, comment_id, user_id);
    res.status(200).json({ message: 'Comment Update Success' });
  }
  catch{
    res.status(500).json({ message: 'Comment Update Failed' });
  }
});
/**
 * @swagger
 * /api/comment/{commentId}:
 *   delete:
 *     summary: Delete Comment
 *     description: Delete Comment
 *     parameters:
 *      - name: commentId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - comment
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: 성공 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   example: "Comment Delete Success."
 *       500:
 *         description: Comment Delete Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment Delete Failed."
 */
router.delete('/comment/:comment_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const {comment_id = ''} = req.params;
  const {user_id = ''} = req.user.id;
  try{
    await postService.commentDelete(comment_id, user_id);
    res.status(200).json({ message: 'Comment Delete Success' });
  }
  catch{
    res.status(500).json({ message: 'Comment Delete Failed' });
  }
});

module.exports = router;