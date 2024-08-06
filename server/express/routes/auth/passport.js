import passport, { use } from 'passport';
import { authMember } from '../../db';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256']
};

use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    console.log(jwt_payload);
    await authMember(jwt_payload.id);
    return done(null, jwt_payload);
  } 
  catch (err) {
    return done(err, false);
  }
}));

export default passport;