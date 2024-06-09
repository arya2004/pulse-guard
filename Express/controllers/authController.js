const Patient = require('../models/patient');
const passport = require('passport');

module.exports.renderLogin = (req, res) => {
    res.render('login.ejs');
};

module.exports.login = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
});

module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', "Goodbye!");
        res.redirect('/');
    });
};
