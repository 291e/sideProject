const express = require('express');
const passport = require('./auth/passport');
const postService = require('./service/postService');
const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), async function (req, res) {
    //const limit = req.query.limit;
    try{
        const posts = await postService.getPosts();
        res.status(200).json({ posts });
    }
    catch{
        res.status(500).json({ message: 'Get Failed' });
    }
});

router.get('/{id}', passport.authenticate('jwt', { session: false }), async function (req, res) {
    try{
      const post = await postService.getPost(id);
      res.status(200).json({ post });
    }
    catch{
      res.status(500).json({ message: 'Get Failed' });
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

router.put('/{id}', passport.authenticate('jwt', { session: false }), async function (req, res) {
    const { title = '', content = '' } = req.body;
    try{
      await postService.postUpdate([title, content, id]);
      res.status(200).json({ message: 'Update Success' });
    }
    catch{
      res.status(500).json({ message: 'Update Failed' });
    }
});

router.delete('/{id}', passport.authenticate('jwt', { session: false }), async function (req, res) {
    try{
      await postService.postDelete(id);
      res.status(200).json({ message: 'Delete Success' });
    }
    catch{
      res.status(500).json({ message: 'Delete Failed' });
    }
});

module.exports = router;