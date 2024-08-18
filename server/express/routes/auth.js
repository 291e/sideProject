const express = require('express');
const router = express.Router();
const authService = require('./service/authService');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Signup User
 *     description: Request to signup a new user with username, email, and password
 *     tags: 
 *       - auth
 *     requestBody:
 *       description: User object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: JohnDoe
 *               email:
 *                 type: string
 *                 example: abcd1234@abcd.com
 *               password:
 *                 type: string
 *                 example: qwer1234
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: A signup of user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Register Success"
 *       400:
 *         description: Invalid String
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid String"
 */

router.post('/signup', async function(req, res, next) {
  const {username = '', email= '', password = ''} = req.body;
  const result = await authService.signup(username,email,password);
  res.status(result[0]).json({ message: result[1] });
  
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login User
 *     description: Request to login a user with email and password
 *     tags: 
 *       - auth
 *     requestBody:
 *       description: User object that needs to be login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: abcd1234@abcd.com
 *               password:
 *                 type: string
 *                 example: qwer1234
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login Success"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request"
 *       401:
 *         description: Unauthorized - Invalid Password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Password"
 */

router.post('/login', async function(req, res, next) {
  const {email= '', password = ''} = req.body;
  const result = await authService.login(email,password);
  res.status(result[0]).cookie('token',result[1], {httpOnly: true, secure: false, sameSite: 'strict'});
  res.json({ token: result[1] })
});

module.exports = router;