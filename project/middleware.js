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
const Test = require('./models/test')
const Pulse = require('./models/pulse')
const Patient = require('./models/patient')
const PulseArchieve = require('./models/pulse_archive');
const pulseTimeseries = require('./models/pulse-timeseries');


module.exports.isDoctor = (req,res,next)=>{
    if(!req.user.isDoctor){
        console.log("not a Doc")
        return res.send('not a doc')
    }
    else{
        next();
    }
}

module.exports.isLoggedin = (req,res,next)=>{
    if (!req.isAuthenticated()) {
        res.send("login first")
    }   
    else{
        next();
    }
}

module.exports.isPatient = (req,res,next)=>{
    if(req.user.isDoctor){
        console.log("not a patienr")
        return res.send('not a patinet')
        
        
    }
    else{
        next();
    }
}

module.exports.ttt =  (req,res,next)=>{
    console.log(req.user.username)
    console.log(req.user.isDoctor)
    next();
}