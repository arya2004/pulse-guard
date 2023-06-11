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
const nodecallspython = require("node-calls-python");
const axios = require('axios');

const Push = require('push.js')



const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const Test = require('./models/test')
const Pulse = require('./models/pulse')
const Patient = require('./models/patient')
const PulseArchieve = require('./models/pulse_archive');
const PulseTimeseries = require('./models/pulse-timeseries');
const { isDataView } = require('util/types');
const { isDoctor, isLoggedin, isPatient,ttt } = require('./middleware');

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
//passport.use('patientLocal',new localStrategy(Patient.authenticate()))
passport.use(Patient.createStrategy());
passport.serializeUser(Patient.serializeUser())
passport.deserializeUser(Patient.deserializeUser())
//added comment

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

//isLoggedin,isPatient,
app.get('/2/:id',isLoggedin,isPatient, async(req,res)=>{

    try {
        console.log(req.params);
        const {id} = req.params;
        //let pulsets = await PulseTs.find({metatada.pulse: id}).sort({_id:-1}).limit(1)
        let pulse = await Pulse.find({patient: id}).sort({_id:-1}).limit(1)
        console.log(pulse)
        //console.log(pulse[0].pulse)
        res.send(pulse[0].pulse.toString());
        
    } catch (error) {
        console.log(error)
    }


    }
)

app.get("/3",(req,res)=>{
    res.render('pages-error-404.ejs')
})
app.get('/4',isLoggedin, isDoctor, async(req,res)=>{

    try {
        const archieve = await Patient.find({isDoctor: false}).populate('pulseArchieve')
        res.render('t.ejs',{archieve})
        
    } catch (error) {
       // console.log(error)
    }


})

app.get('/team',(req,res)=>{
    res.render('team.ejs')
    
})

app.get('/new', (req,res)=>{
    res.render('new.ejs')
    
})

app.get('/prediction', (req,res)=>{
    res.render('prediction.ejs')
})





app.get('/login', (req,res)=>{
    res.render('login.ejs')
    
})

app.get('/logout',isLoggedin,(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/');
      });
    }); 

app.post('/stroke', async(req,res)=>{
        if(!req.isAuthenticated()){
            return res.send("not authenticated")
        }
        try {

            console.log(req.body)
            const {age, hypertension, heart_disease, ever_married, work_type, Residence_type, avg_glucose_level, bmi, gender, smoking_status} = req.body;

            const requestBody = {
                age: age.toString(),
                hypertension: hypertension.toString(),
                heart_disease: heart_disease.toString(),
                ever_married: ever_married.toString(),
                work_type: work_type.toString(),
                Residence_type: Residence_type.toString(),
                avg_glucose_level: avg_glucose_level.toString(),
                bmi: bmi.toString(),
                gender: gender.toString(),
                smoking_status: smoking_status.toString()

              };

 let dataa;

axios.post('http://127.0.0.1:5000/lul', 
            requestBody
  )
  .then(function (response) {
    console.log(response.data);
    dataa = response.data.toString();
    return res.render('info.ejs', {dataa})
    //res.send(response.data.toString())
  })
  .catch(function (error) {
    console.log(error);
  });

    
        
           // res.render('info.ejs', {ss})
            
        } catch (error) {
            console.log(error)
        }
    
    
    })




app.get('/:id',connectLiveReload(), async(req,res)=>{
    if(!req.isAuthenticated()){
        return res.send("not authenticated")
    }
    try {
        const {id} = req.params;
        const test = await Patient.findById(req.params.id).populate('pulse').populate('pulseArchieve')
        if(!test._id.equals(req.user._id)){
            return res.send("not owner")
        }
    
        res.render('dashboard.ejs',{test} )
        
    } catch (error) {
        //console.log(error)
    }


})


app.post('/new',async(req,res)=>{
try{
    const{username, email, password} = req.body;
    const patient = new Patient(req.body);
    const registeredPatient = await Patient.register(patient,password)
    console.log(registeredPatient)
    res.redirect('/')
}catch(e){
    console.log(e)
    res.redirect('/')
 }

})

app.post('/login', passport.authenticate('local'), (req,res)=>{
    try {
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
   
    
})

app.post('/', (req,res)=>{
    console.log(req.params);
    console.log(req.body);
    res.redirect("/")
    
    
})

app.post('/:id/esp32', async(req,res)=>{
    const {id} = req.params
    let items = await Pulse.find({ patient: id })
    .sort({ _id: -1 })
    .limit(10)
    const array = items.map(item => item.pulse);
    console.log(array);
    const test = await Patient.findById(id)
    const rate = req.body.pulse;
    const pulse = new Pulse();
    const pulsets = new PulseTimeseries()
    const date = new Date();
    pulse.calculated_at = date.getTime()
    pulse.pulse = req.body.pulse;
    pulse.patient = id;
    pulse.rate = req.body.pulse;
    pulsets.calculated_at = date.getTime()
    pulsets.pulse = req.body.pulse;
    pulsets.patient = id;
    pulsets.rate = req.body.pulse;
    pulsets.save()
    pulse.save()
    test.pulse.push(pulse)
    test.pulsetimeseries.push(pulsets)
    console.log(req.params)
    console.log(req.body)
    //bradycardia <40; tachycardia >100
    let mean = 0;
    for (let index = 0; index < array.length; index++) {
         mean = mean+  array[index];
    }
    mean = mean/10;
    if (mean>100) {
        
        const tachycardia = new PulseArchieve();
        tachycardia.calculated_at = date.getTime();
        tachycardia.pulse = mean;
        tachycardia.patient = id;
        test.pulseArchieve.push(tachycardia);  
        await tachycardia.save() 
        await test.save()
        return res.sendStatus(201)
    }
    if (mean<40) {
        const bradycardia = new PulseArchieve();
        bradycardia.calculated_at = date.getTime();
        bradycardia.pulse = mean;
        bradycardia.patient = id;
        test.pulseArchieve.push(bradycardia);
        await bradycardia.save()
        await test.save();
        return res.sendStatus(202)
    }
    console.log(mean)
    await test.save()
    res.sendStatus(200)

})

app.get("*",(req,res)=>{
    res.render('pages-error-404.ejs')
})

app.listen(3000,()=>{
    console.log('sucsex')
})