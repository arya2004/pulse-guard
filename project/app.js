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
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const d3 = import("d3");


const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const Test = require('./models/test')
const Pulse = require('./models/pulse')
const Patient = require('./models/patient')
const PulseArchieve = require('./models/pulse_archive')

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





passport.use('patientLocal',new localStrategy(Patient.authenticate()))
passport.serializeUser(Patient.serializeUser())

passport.deserializeUser(Patient.deserializeUser())


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
    let a = (70+(Math.random()*10)-(Math.random()*10)).toString();
    console.log(a)
    res.send(a);
    
    
})


app.get('/2', async(req,res)=>{
    let pulse = await Pulse.findOne().sort({_id:-1})
   // let pulse = await Pulse.find().sort({ _id: 1 }).limit(1);
    let pulse1 = pulse.toString();

    console.log(pulse.pulse)
   
    //console.log(pulse)
    res.send(pulse.pulse.toString());
    
    
})

app.get('/3', (req,res)=>{
    res.render('tables-data.ejs')
    
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

app.get('/logout',(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/');
      });
    }); 

app.get('/test', (req,res)=>{
    res.render('test.ejs')
    
})


app.get('/:id',connectLiveReload(), async(req,res)=>{
    if(!req.isAuthenticated()){
        return res.send("not authenticated")
    }
    const {id} = req.params;
    const test = await Patient.findById(req.params.id).populate('pulse')
    if(!test._id.equals(req.user._id)){
        return res.send("not owner")
    }

     //arr = JSON.stringify(arr);
    res.render('dashboard.ejs',{test} )

})

app.post('/new',async(req,res)=>{
try{
    const{username, email, password} = req.body;
    const patient = new Patient(req.body);
    const registeredPatient = await Patient.register(patient,password)
    console.log(registeredPatient)
    res.redirect('/')
}catch(e){
    res.redirect('/')
 }

})



app.post('/login', passport.authenticate('patientLocal'), (req,res)=>{
    res.redirect('/')
    
})



app.post('/', (req,res)=>{
    console.log(req.params);
    console.log(req.body);
    res.redirect("/")
    
    
})

app.post('/:id/esp32', async(req,res)=>{
    const {id} = req.params
    let pulse_archive = await Pulse.aggregate([
        // First sort all the docs by name
        {$sort: {_id: -1}},
        // Take the first 100 of those
        {$limit: 10},
        // Of those, take only ones where marks > 35
        //{$match: {marks: {$gt: 35}}}
       //{$match: {metadata: {id}}}
       
    ])
      console.log(pulse_archive)
    const test = await Patient.findById(id)
    const rate = req.body.pulse;
    const pulse = new Pulse();
    const date = new Date();
    pulse.calculated_at = date.getTime()
    pulse.pulse = req.body.pulse;
    pulse.metadata.patient = id;
    pulse.rate = req.body.pulse;
    pulse.save()
    test.pulse.push(pulse)
    test.save()
   // console.log(pulse)
    console.log(req.params)
    console.log(req.body)
    res.sendStatus(200)

})

app.get("*",(req,res)=>{
    res.render('pages-error-404.ejs')
})

app.listen(3000,()=>{
    console.log('sucsex')
})