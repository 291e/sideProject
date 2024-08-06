import { Router } from 'express';
import { authenticate } from './auth/passport';
import { memberInfo, memberDelete, memberUpdate } from './service/memberService';
const router = Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', authenticate('jwt', { session: false }), async function (req, res) {
  const id = req.user.id;
  const member = await memberInfo(id);
  res.status(200).json({ username: member.name });
});

router.delete('/profile', authenticate('jwt', { session: false }), async function (req, res) {
  const id = req.user.id;
  try{
    await memberDelete(id);
    res.status(200).json({ message: 'Delete Success' });
  }
  catch{
    res.status(500).json({ message: 'Delete Failed' });
  }
});

router.post('/profile/modify', authenticate('jwt', { session: false }), async function (req, res) {
  //입력값 검증 필요
  const member = Object.values(req.body);
  try{
    await memberUpdate(member);
    res.status(200).json({ message: 'Update Success' });
  }
  catch{
    res.status(500).json({ message: 'Update Failed' });
  }
});


export default router;
