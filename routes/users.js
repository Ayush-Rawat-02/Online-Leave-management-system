const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');     //For storing the password in encrypted form
const passport=require('passport');    //For passport authentication

//User model/schema
const User=require('../models/User');
const Leave = require('../models/Leave');
const req = require('express/lib/request');

router.use(express.static(__dirname+'/public'));

//Login page
router.get('/login',(req,res) => res.render('login'));

//Register page
router.get('/register',(req,res) => res.render('register'));

//Register handle
router.post('/register',(req,res)=>{
    const { user_type,name,email,department,password,cpassword} = req.body;
    let errors=[];
    //check required fields
    console.log(`User type : ${user_type}`);
    if(user_type=='----select user type----'){
        errors.push({msg:'Please select user type'});
    }
    if(!name||!email||!department||!password||!cpassword){
        errors.push({msg:'Some fields are missing'});
    }
    //Check length of password (6 minimum)
    else if(password.length<6){
        errors.push({msg:'Atleast 6 characters of Password required'});
    }
    //check confirm password match
    else if(password!=cpassword){
        errors.push({msg:'Passwords do not match'});
    }

    if(errors.length>0)
    res.render('register',{
        errors,
        user_type,
        name,
        email,
        department,
        password,
        cpassword
    });
    //validation passed
    else{
        User.findOne({email:email})
        .then(user=>{
            if(user){
                //User already exists
                errors.push({msg:'Email is already registered'});
                res.render('register',{
                    errors,
                    user_type,
                    name,
                    email,
                    department,
                    password,
                    cpassword
                });
            }
            else{
                //creating a new user
                const newUser=new User({
                    name,
                    user_type,
                    email,
                    department,
                    password
                });
                // console.log(newUser);
                // res.send("Hello");
                bcrypt.genSalt(10,(err,salt)=>
                    bcrypt.hash(newUser.password,10,(err,hash)=>{
                        if(err) throw err;
                        //set password to hashed
                        newUser.password = hash;
                        //save user
                        newUser.save()
                            .then(user=>{
                                //creating flash messages after registration of new user
                                //you need to display these messages in ejs file  and dismissable bootstrap is required to display message before redirecting
                                req.flash('success_msg','You are now registered now login');
                                res.redirect('/users/login');
                            })
                            .catch(err=>console.log(err));
                }));
            }
        });
    }
});

//If you try to use name here outside of router.post callback function it is depricated as it is local to the function above
//however other variables will work , this is mystery in javascript XD


//Login handle
router.post('/login',(req,res,next)=>{
    console.log("LoginHandle");
    console.log(req.body);
    if(req.body.email!=''&&req.body.password!=''){
        passport.authenticate('local',{
            successRedirect : '/dashboard',
            failureRedirect : '/users/login',
            failureFlash : true
        })(req,res,next);
    }
    else{
        req.flash('error_msg','Some fields are missing');
        res.redirect('/users/login');
    }
    
});



//logout handle
router.get('/logout',(req,res) => {
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});



module.exports = router;