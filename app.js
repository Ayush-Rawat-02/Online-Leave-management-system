//we use layouts to shorten the code and reuse it
//we use mongoose to store registered user in a mongodb schema
//we use flash to display flash messages(without bootstrap and needed to be included in ejs file)
//express session is middleware of flash
//now for login logic passport js comes into play
const express=require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');                 //Used to display flash messages like after a user registers then the message will be shown that user is registered
const session = require('express-session');             //It is a middleware of connect-flash
const res = require('express/lib/response');
const passport = require('passport');
var moment = require('moment');
moment().format();

var app=express();

app.use(express.static(__dirname+'/public'));

//passport config
require('./config/passport')(passport);

var port = 3000;

//mongodb config
var url =process.env.DATABASEURL|| "mongodb://localhost/GraphicEra";
//mongodb connection
mongoose
    .connect(url , { useNewUrlParser : true})
    .then(()=>console.log('Connected to db'))
    .catch(err=>{ console.log("Error"),err.message});

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//BodyParser
app.use(express.urlencoded({extended:false}));

//EXPRESS SESSION
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());  

//connect flash
app.use(flash());

//Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');


    // res.locals.success = req.flash("success");
    // res.locals.user = req.user || null;
    next();
});

//Routes
app.use('/',require('./routes/index'));         //or we can use : app.get('/',(req,res) => res.render('welcome'));
app.use('/users',require('./routes/users'));

app.listen(port,console.log(`Server started on port ${port}`));