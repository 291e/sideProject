import { Router } from 'express';
import { authenticate } from './authStrategy/passport';
import { getPosts, getPost, postCreate, postUpdate, postDelete, getComments, commentCreate, commentUpdate, commentDelete, getLikes, getLike, likeCreate, likeDelete } from './service/postService';
const router = Router();

router.get('/', async function (req, res) {
    //const limit = req.query.limit;
    try{
        const posts = await getPosts();
        res.status(200).json({ posts });
    }
    catch(err){
        res.status(500).json({ message: err.message});
    }
});

router.get('/:id', async function (req, res) {
    const { id = '' } = req.params;
    try{
      const post = await getPost(id);
      const comments = await getComments(id);
      const likes = await getLikes(id);
      const like = await getLike(id, req.user.id);
      res.status(200).json({ post, comments, likes, like });
    }
    catch(err){
      res.status(500).json({ message: err.message });
    }
});

router.post('/', authenticate('jwt', { session: false }), async function (req, res) {
    const { title = '', content = '' } = req.body;
    const id = req.user.id;
    try{
      await postCreate([title, content, id]);
      res.status(200).json({ message: 'Create Success' });
    }
    catch{
      res.status(500).json({ message: 'Create Failed' });
    }
});

router.put('/:id', authenticate('jwt', { session: false }), async function (req, res) {
    const { title = '', content = '' } = req.body;
    const { id = '' } = req.params;
    try{
      await postUpdate([title, content, id]);
      res.status(200).json({ message: 'Update Success' });
    }
    catch{
      res.status(500).json({ message: 'Update Failed' });
    }
});

router.delete('/:id', authenticate('jwt', { session: false }), async function (req, res) {
    const { id = '' } = req.params;
    try{
      await postDelete(id);
      res.status(200).json({ message: 'Delete Success' });
    }
    catch{
      res.status(500).json({ message: 'Delete Failed' });
    }
});

router.post('/like/:post_id', authenticate('jwt', { session: false }), async function (req, res) {
  const { post_id = '' } = req.params;
  const { user_id = '' } = req.user.id;
  try{
    await likeCreate(post_id, user_id);
    res.status(200).json({ message: 'Like Success' });
  }
  catch{
    res.status(500).json({ message: 'Like Failed' });
  }
});

router.delete('/like/:like_id', authenticate('jwt', { session: false }), async function (req, res) {
  const { like_id = '' } = req.params;
  const { user_id = '' } = req.user.id;
  try{
    await likeDelete(like_id, user_id);
    res.status(200).json({ message: 'Like Delete Success' });
  }
  catch{
    res.status(500).json({ message: 'Like Delete Failed' });
  }
});

router.post('/comment/:post_id', authenticate('jwt', { session: false }), async function (req, res) {
  const { post_id = '' } = req.params;
  const { user_id = '' } = req.user.id;
  const { comment = '' } = req.body;
  try{
    await commentCreate(comment, post_id, user_id);
    res.status(200).json({ message: 'Comment Create Success' });
  }
  catch{
    res.status(500).json({ message: 'Comment Create Failed' });
  }
});

router.put('/comment/:comment_id', authenticate('jwt', { session: false }), async function (req, res) {
  const { comment = '' } = req.body;
  const { comment_id = '' } = req.params;
  const { user_id = '' } = req.user.id;
  try{
    await commentUpdate(comment, comment_id, user_id);
    res.status(200).json({ message: 'Comment Update Success' });
  }
  catch{
    res.status(500).json({ message: 'Comment Update Failed' });
  }
});

router.delete('/comment/:comment_id', authenticate('jwt', { session: false }), async function (req, res) {
  const {comment_id = ''} = req.params;
  const {user_id = ''} = req.user.id;
  try{
    await commentDelete(comment_id, user_id);
    res.status(200).json({ message: 'Comment Delete Success' });
  }
  catch{
    res.status(500).json({ message: 'Comment Delete Failed' });
  }
});

export default router;