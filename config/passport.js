const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');           //to access the models
const bcrypt = require('bcryptjs');             //to decrypt the password of user

//Load user model
const User=require('../models/User');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField : 'email' },(email,password,done)=>{
                //Match User using mongoose
                User.findOne({email:email})
                .then(user=>{
                    if(!user){
                        return done(null,false,{message: 'Email/User is not registered'});
                    }
                    //Match password                            here user.password is hashed 
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;

                    if(isMatch){
                        return done(null,user);
                    }
                    else{
                        return done(null,false,{message: 'Password does not match'});
                    }
                });
            })
            .catch(err=>console.log(err));
        })
    );
    //creates a login session after authentication and deletes it after it is done
    passport.serializeUser(function(user, done) {                    //or(user.done)=>{
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
};