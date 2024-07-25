const express = require('express');
const passport = require('./passport');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'This is a protected route'});
});

module.exports = router;
