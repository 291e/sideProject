const express = require('express');
const router = express.Router();
const authService = require('./service/authService');

router.post('/signup', async function(req, res, next) {
  const {username = '', email= '', password = ''} = req.body;
  const result = await authService.signup(username,email,password);
  res.status(result[0]).json({ message: result[1] });
  
});

router.post('/login', async function(req, res, next) {
  const {email= '', password = ''} = req.body;
  const result = await authService.login(email,password);
  res.status(result[0]).cookie('token',result[1], {httpOnly: true, secure: false, sameSite: 'strict'});
  res.json({ token: result[1] })
});

router.get('/', async function(req, res, next) {
  res.status(200).json({ message: 'hello im backend server' });
});

module.exports = router;