const express = require('express');
const passport = require('./authStrategy/passport');
const router = express.Router();
const memberService = require('./service/memberService');
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get Profile
 *     description: Get Profile
 *     tags: 
 *      - profile
 *     security:
 *      - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: A Profile object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 member:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "이름..."
 *                 followings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       follower:
 *                         type: string
 *                         example: "user_id..."
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       following:
 *                         type: string
 *                         example: "user_id..."
 *       500:
 *         description: Get Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get Failed."
 */
router.get('/profile', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const id = req.user.id;
  try{
    const member = await memberService.getMember(id);
    const followings = await memberService.getFollowings(id);
    const followers = await memberService.getFollowers(id);
    res.status(200).json({ member, followings, followers });
  }catch(err){
    res.status(500).json({ message: 'Get Failed.' });
  }
});
/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update Profile
 *     description: Update Profile
 *     tags: 
 *      - profile
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       description: Profile Update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: JohnDoe
 *             required:
 *               - name
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
 *                   example: "Profile Update Success."
 *       500:
 *         description: Profile Update Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile Update Failed."
 */
router.put('/profile', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const {name = ''} = req.body;
  const auth_id = req.user.id;
  
  try{
    await memberService.memberUpdate(name, auth_id);
    res.status(200).json({ message: 'Profile Update Success' });
  }
  catch{
    res.status(500).json({ message: 'Profile Update Failed' });
  }
});
/**
 * @swagger
 * /api/users/profile:
 *   delete:
 *     summary: Delete Profile
 *     description: Delete Profile
 *     tags: 
 *      - profile
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
 *                   example: "Profile Delete Success."
 *       500:
 *         description: Profile Delete Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile Delete Failed."
 */
router.delete('/profile', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const auth_id = req.user.id;
  try{
    await memberService.memberDelete(auth_id);
    res.status(200).json({ message: 'Profile Delete Success' });
  }
  catch{
    res.status(500).json({ message: 'Profile Delete Failed' });
  }
});

/**
 * @swagger
 * /api/users/profile/{userId}:
 *   get:
 *     summary: "Get Profile"
 *     description: "Get Profile"
 *     parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - profile
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: A Profile object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 member:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "이름..."
 *                 followings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       follower:
 *                         type: string
 *                         example: "user_id..."
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       following:
 *                         type: string
 *                         example: "user_id..."
 *                 isFollowing:
 *                   type: object
 *                   example: "1"
 *       500:
 *         description: Get Failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get Failed."
 */
router.get('/profile/:user_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const {user_id = ''} = req.params;
  const auth_id = req.user.id;
  try{
    const member = await memberService.getMember(user_id);
    const followings = await memberService.getFollowings(user_id);
    const followers = await memberService.getFollowers(user_id);
    const isFollowing = await memberService.isFollowing(user_id, auth_id);
    res.status(200).json({ member, followings, followers, isFollowing });
  }catch(err){
    res.status(500).json({ message: 'Get Failed.' });
  }
});

/**
 * @swagger
 * /api/users/follow/{followId}:
 *   post:
 *     summary: "Create Follow"
 *     description: "Create Follow"
 *     parameters:
 *      - name: followId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - follow
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
 *                   example: "Follow Success"
 *       500:
 *         description: Follow Failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Follow Failed"
 */
router.post('/follow/:follow_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const {follow_id = ''} = req.params;
  const following_id = req.user.id;
  try{
    await memberService.followingCreate(follow_id, following_id);
    res.status(200).json({ message: 'Follow Success' });
  }
  catch{
    res.status(500).json({ message: 'Follow Failed' });
  }
});
/**
 * @swagger
 * /api/users/follow/{followId}:
 *   delete:
 *     summary: "Delete Follow"
 *     description: "Delete Follow"
 *     parameters:
 *      - name: followId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: 
 *      - follow
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
 *                   example: "Unfollow Success"
 *       500:
 *         description: Unfollow Failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unfollow Failed"
 */
router.delete('/follow/:follow_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const {follow_id = ''} = req.params;
  const following_id = req.user.id;
  try{
    await memberService.followingDelete(follow_id, following_id);
    res.status(200).json({ message: 'Unfollow Success' });
  }
  catch{
    res.status(500).json({ message: 'Unfollow Failed' });
  }
});

module.exports = router;
