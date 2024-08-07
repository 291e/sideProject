import { Router } from 'express';
const router = Router();
import { signup, login } from './service/authService';

router.post('/signup', async function(req, res, next) {
  const {username = '', email= '', password = ''} = req.body;
  const result = await signup(username,email,password);
  res.status(result[0]).json({ message: result[1] });
  
});

router.post('/login', async function(req, res, next) {
  const {email= '', password = ''} = req.body;
  const result = await login(email,password);
  res.status(result[0]).cookie('token',result[1], {httpOnly: true, secure: false, sameSite: 'strict'});
  res.json({ token: result[1] })
});

router.get('/', async function(req, res, next) {
  res.status(200).json({ message: 'hello im backend server' });
});

export default router;