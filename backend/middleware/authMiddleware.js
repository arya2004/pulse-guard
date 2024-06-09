module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.isPatient = (req, res, next) => {
    if (req.user && req.user.role === 'patient') {
        return next();
    }
    req.flash('error', 'You do not have permission to do that!');
    res.redirect('/');
};

module.exports.isDoctor = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') {
        return next();
    }
    req.flash('error', 'You do not have permission to do that!');
    res.redirect('/');
};
