const passport = require('passport');
const dbcon = require('../db');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = new dbcon;
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const result = await db.selectMember(jwt_payload.id);
    return done(null, result);
  } 
  catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;