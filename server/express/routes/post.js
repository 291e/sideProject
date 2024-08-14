const express = require('express');
const passport = require('./authStrategy/passport');
const postService = require('./service/postService');
const router = express.Router();

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

router.get('/:id', async function (req, res) {
    const { id = '' } = req.params;
    try{
      const post = await postService.getPost(id);
      const comments = await postService.getComments(id);
      const likes = await postService.getLikes(id);
      const like = await postService.getLike(id, req.user.id);
      res.status(200).json({ post, comments, likes, like });
    }
    catch(err){
      res.status(500).json({ message: err.message });
    }
});

router.post('/', passport.authenticate('jwt', { session: false }), async function (req, res) {
    const { title = '', content = '' } = req.body;
    const id = req.user.id;
    try{
      await postService.postCreate([title, content, id]);
      res.status(200).json({ message: 'Create Success' });
    }
    catch{
      res.status(500).json({ message: 'Create Failed' });
    }
});
router.put('/:id', passport.authenticate('jwt', { session: false }), async function (req, res) {
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
router.delete('/:id', passport.authenticate('jwt', { session: false }), async function (req, res) {
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