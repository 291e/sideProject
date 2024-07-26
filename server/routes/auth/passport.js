const passport = require('passport');
const db = require('../../db');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256']
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    console.log(jwt_payload);
    await db.authMember(jwt_payload.id);
    return done(null, jwt_payload);
  } 
  catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;