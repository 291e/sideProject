import { Router } from 'express';
import { authenticate } from './authStrategy/passport';
import { getMember, memberDelete, memberUpdate, getFollowers, getFollowings} from './service/memberService';
const router = Router();

router.get('/profile', authenticate('jwt', { session: false }), async function (req, res) {
  const id = req.user.id;
  const member = await getMember(id);
  const followings = await getFollowings(id);
  const followers = await getFollowers(id);
  res.status(200).json({ member, followings, followers });
});
router.put('/profile', authenticate('jwt', { session: false }), async function (req, res) {
  const {name = ''} = req.body;
  const auth_id = req.user.id;
  
  try{
    await memberUpdate(name, auth_id);
    res.status(200).json({ message: 'Profile Update Success' });
  }
  catch{
    res.status(500).json({ message: 'Profile Update Failed' });
  }
});
router.delete('/profile', authenticate('jwt', { session: false }), async function (req, res) {
  const auth_id = req.user.id;
  try{
    await memberDelete(auth_id);
    res.status(200).json({ message: 'Profile Delete Success' });
  }
  catch{
    res.status(500).json({ message: 'Profile Delete Failed' });
  }
});

router.get('/profile/:user_id', authenticate('jwt', { session: false }), async function (req, res) {
  const {user_id = ''} = req.params;
  const auth_id = req.user.id;
  const member = await getMember(user_id);
  const followings = await getFollowings(user_id);
  const followers = await getFollowers(user_id);
  const isFollowing = await isFollowing(user_id, auth_id);
  res.status(200).json({ member, followings, followers, isFollowing });
});

router.post('/follow/:follow_id', authenticate('jwt', { session: false }), async function (req, res) {
  const {follow_id = ''} = req.params;
  const following_id = req.user.id;
  try{
    await followingCreate(follow_id, following_id);
    res.status(200).json({ message: 'Follow Success' });
  }
  catch{
    res.status(500).json({ message: 'Follow Failed' });
  }
});

router.delete('/follow/:follow_id', authenticate('jwt', { session: false }), async function (req, res) {
  const {follow_id = ''} = req.params;
  const following_id = req.user.id;
  try{
    await followingDelete(follow_id, following_id);
    res.status(200).json({ message: 'Unfollow Success' });
  }
  catch{
    res.status(500).json({ message: 'Unfollow Failed' });
  }
});

export default router;
