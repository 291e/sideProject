const passport = require('passport');
const db = require('../db');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    await db.authMember(jwt_payload.id);
    return done(null, jwt_payload);
  } 
  catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;