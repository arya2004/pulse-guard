const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const axios = require('axios');
const { sessionConfig } = require('./utils/sessionConfig');
const { isLoggedin, isPatient, isDoctor } = require('./middleware/authMiddleware');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const pulseRoutes = require('./routes/pulseRoutes');

mongoose.connect('mongodb://127.0.0.1:27017/patient-data')
    .then(() => console.log('DB connected!!!'))
    .catch(err => console.error('Connection error:', err));

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(Patient.createStrategy());
passport.serializeUser(Patient.serializeUser());
passport.deserializeUser(Patient.deserializeUser());

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/patients', patientRoutes);
app.use('/pulses', pulseRoutes);

app.get("*", (req, res) => {
    res.render('pages-error-404.ejs');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
