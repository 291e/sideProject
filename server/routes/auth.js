const express = require('express');
const dbcon = require('../db');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('./passport');
const router = express.Router();
const db = new dbcon;
db.connect();
db.create();

router.post('/signup', async function(req, res, next) {
  const {username, email, password} = req.body

  if(!validator.isAlphanumeric(username) || !validator.isEmail(email) || !validator.isAlphanumeric(password)){
    res.status(400).json({ message: 'Invalid string.' });
  }
  else{
    try{
      await registerMember(username,email,password);
      res.status(200).json({ message: 'success' });
    }
    catch(err){
      res.status(401).json({ message: err.message });
    }
  }
});

router.post('/login', async function(req, res, next) {
  const {email, password} = req.body
  const id = email;
  console.log(req.body);
  if(!validator.isEmail(email) || !validator.isAlphanumeric(password)){
    res.status(400).json({ message: 'Invalid string.' });
  }
  else{
    try{
    const salt = await db.selectMember(email);
    const isMatch = await bcrypt.compare(password, salt.password);
    
    if(isMatch){
      //jwt token 발급
      const token = jwt.sign({ id: email }, process.env.JWT_SECRET, { expiresIn: '20m' });
      res.status(200).json({ token: token });
    }
    else{
      res.status(401).json({ message: 'invalid password' });
    }
    }
    catch(err){
      res.status(401).json({ message: err.message });
    }
  }
});

router.get('/', async function(req, res, next) {
  res.status(200).json({ message: 'hello im backend server' });
});

router.post('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'This is a protected route'});
});

async function registerMember(username, id, password) {
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.begin();
    await db.insertMember(username,id,hashedPassword);
    await db.commit();
  } 
  catch (err) {
    await db.rollback();
    throw new Error('Duplicate id');
  }
}

module.exports = router;