const router = require('express').Router();
const multer = require('multer');

const controller = require('./controller');
const LocalStrategy = require('passport-local').Strategy;
const passport  = require('passport');

passport.use(new LocalStrategy({usernameField:'email'},controller.localStrategy));

router.post('/register',multer().none(),controller.register);
router.post('/login',multer().none(),controller.login);
router.post('/logout',multer().none(),controller.logout);
router.get('/me',controller.me);

module.exports = router;