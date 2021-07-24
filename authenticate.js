const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());