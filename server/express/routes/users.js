const express = require('express');
const passport = require('./authStrategy/passport');
const router = express.Router();
const memberService = require('./service/memberService');

router.get('/profile', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const id = req.user.id;
  const member = await memberService.getMember(id);
  const followings = await memberService.getFollowings(id);
  const followers = await memberService.getFollowers(id);
  res.status(200).json({ member, followings, followers });
});
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

router.get('/profile/:user_id', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const {user_id = ''} = req.params;
  const auth_id = req.user.id;
  const member = await memberService.getMember(user_id);
  const followings = await memberService.getFollowings(user_id);
  const followers = await memberService.getFollowers(user_id);
  const isFollowing = await memberService.isFollowing(user_id, auth_id);
  res.status(200).json({ member, followings, followers, isFollowing });
});

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
