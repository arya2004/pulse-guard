module.exports.renderHome = (req, res) => {
    res.render('index.ejs');
};

module.exports.renderErrorPage = (req, res) => {
    res.render('pages-error-404.ejs');
};

module.exports.renderTeam = (req, res) => {
    res.render('team.ejs');
};

module.exports.renderNew = (req, res) => {
    res.render('new.ejs');
};

module.exports.renderPrediction = (req, res) => {
    res.render('prediction.ejs');
};
