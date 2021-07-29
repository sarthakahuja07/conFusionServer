const User = require('./models/user');
const passport = require('passport');
const config = require('./config');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const FacebookStrategy = require('passport-facebook').Strategy;

//LOCAL STRATEGY

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//JWT
exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey,
        { expiresIn: 3600 });
};

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload._id }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next()
    } else {
        err = new Error("You are not authorized to perform this operation!")
        err.status = 404;
        next(err);
    }
}

// Passport Facebook

passport.use(new FacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOne({ facebookId: profile.id }, function (err, user) {
            if (err) {
                return cb(err, false);
            }
            if (user) {
                cb(null, user);
            } else {
                user = new User({
                    username: profile.displayName,
                    facebookId : profile.id,
                    firstname : profile.name.givenName,
                    lastname : profile.name.familyName
                });
                user.save(function (err) {
                    if (err) {
                        return cb(err, false);
                    } else {
                        cb(null, user);
                    }
                });
            }
        });
    }
));