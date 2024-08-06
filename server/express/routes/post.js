import { Router } from 'express';
import { authenticate } from './auth/passport';
import { getPosts, getPost, postCreate, postUpdate, postDelete } from './service/postService';
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
      res.status(200).json({ post });
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
    console.log(id);
    console.log(title);
    console.log(content);
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

export default router;