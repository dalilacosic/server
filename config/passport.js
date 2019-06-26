
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local').Strategy,
  config = require('./passport.cred'),
  comparePassword = require('../utils/comparePassword'),
  User = require('../models/users');


module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, async (payload, done) => {
    try{
      let user = await User.findById(payload.id);
      if(user) done(null,user);
      else done(null, false);
    }catch (err){
      done(err, null);
    }
  }));


  const localOpts = {
    usernameField: 'email'
  };
  passport.use('login', new LocalStrategy(localOpts,async (email, password, done) => {
    try{
      let user = await User.findOne({ email: email });
      if(user){
        let isMatch = await comparePassword(password, user.password);
        if(isMatch)
          return done(null,user);
      }
      done(null,false);
    } catch (err){
      return done(err,null);
    }
  }));
};