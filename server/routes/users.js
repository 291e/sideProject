const express = require('express');
const passport = require('./passport');
const router = express.Router();
const memberService = require('./service/memberService');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/profile', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const id = req.user.id;
  const member = await memberService.memberInfo(id);
  res.status(200).json({ member });
});

router.post('/profile/modify', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const member = Object.values(req.body);
  try{
    await memberService.memberUpdate(member);
    res.status(200).json({ message: 'Update Success' });
  }
  catch(err){
    res.status(500).json({ message: 'Update Failed' });
  }
});


module.exports = router;
