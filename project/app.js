const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session')
const flash = require('connect-flash')

const Test = require('./models/test')


const sessionConfig = {
    secret: 'thisshouldbeabetersectere',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + (1000*60*60*24*7),
        maxAge: (1000*60*60*24*7)
    }

}



mongoose.connect('mongodb://127.0.0.1:27017/patient-data')
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connecton error:"));
db.once("open", ()=>{
    console.log("DB connected!!!")
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.engine('ejs', ejsMate)

app.use(session(sessionConfig))
app.use(flash())
 app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(Test.authenticate()))

passport.serializeUser(Test.serializeUser())
passport.deserializeUser(Test.deserializeUser())

//universal middleware
app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req,res)=>{
    res.render('index.ejs')
    
})
app.get('/1', (req,res)=>{
    res.render('inner-page.ejs')
    
})

app.get('/team', (req,res)=>{
    res.render('team.ejs')
    
})

app.get('/new', (req,res)=>{
    res.render('new.ejs')
    
})
app.get('/login', (req,res)=>{
    res.render('login.ejs')
    
})

app.get('/test', (req,res)=>{
    res.render('test.ejs')
    
})


app.post('/new',async(req,res)=>{
try{
    const{username, email, password} = req.body;
    const test = new Test({username, email});
    const registeredTest = await Test.register(test,password)
    res.redirect('/')
}catch(e){
    res.redirect('/')
}

})

app.post('/login', passport.authenticate('local'), (req,res)=>{
    res.redirect('/')
    
})

app.post('/', (req,res)=>{
    console.log(req.params);
    console.log(req.body);
    res.redirect("/")
    
    
})

app.get("*",(req,res)=>{
    res.render('index.ejs')
})

app.listen(3000,()=>{
    console.log('sucsex')
})