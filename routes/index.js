const flash = require('connect-flash/lib/flash');
const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const moment=require('moment');

const {ensureAuthenticated } = require('../config/auth');
const { db } = require('../models/Leave');
const Leave = require('../models/Leave');
const User = require('../models/User');
//const Leave = require('../models/Leave');

router.use(express.static(__dirname+'/public'));

router.use(express.urlencoded({extended:false}));

//welcome page
router.get('/',(req,res) => res.render('home',{user:undefined}));
//Dashboard
//router.get('/dashboard',(req,res) => res.render('dashboard'));
//to make the dashboard protected from accessing if user logged out
// router.get('/dashboard',ensureAuthenticated , (req,res)=>{
//     if(req.user.user_type=='Student'){
//         User.findOne({username:req.user.username})
//             .populate("leaves")
//             .exec((err,user)=>{
//                 if(err){
//                     req.flash("error",'User not found');
//                     res.redirect('back');
//                     console.log('err');
//                 }
//                 else{
//                     res.render('dashboard_student',{user:user,moment:moment});
//                 }
//             });
        
//     }
//     else{
//         res.render('dashboard_hod',{user:req.user})
//     }
// });

router.get('/dashboard',ensureAuthenticated , (req,res)=>{
        console.log("Dashboard");
        console.log(req.user);
        User.findOne({email:req.user.email})
            .populate("leaves")
            .exec((err,user)=>{
                if(err){
                    req.flash("error",'User not found');
                    res.redirect('back');
                    console.log('err');
                }
                else{
                    if(req.user.user_type=='Student'){
                        res.render('dashboard_student',{user:user,moment:moment});
                    }
                    else{
                        res.render('dashboard_hod',{user:req.user})
                    }
                }
            });
});

router.get('/users/:id/apply' , ensureAuthenticated , (req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        if(err){
            req.flash('error','Something went wrong')
            console.log(err);
            res.redirect('back');
        }
        else{
            // console.log(req.params.id);
            // console.log(user._id);
            res.render('apply',{user: user});
        }
    });
});

// router.post('/users/:id/apply' , (req,res)=>{
//     User.findById(req.params.id)
//         .populate("leaves")
//         .exec((err,user)=>{
//             if(err){
//                 req.flash("error",'no records');
//                 res.redirect('/dashboard');
//                 console.log('no records found for the user');
//             }
//             else{
                // console.log(req.body);
                // const subject=String(req.body.subject);
                // const fromdt=new Date(req.body.from);
                // const todt=new Date(req.body.to);
                // const days=todt.getDate()-fromdt.getDate();
                
                // const newLeave = new Leave({
                //     subject,
                //     fromdt,
                //     todt,
                //     days,
                //     user:{
                //         id:req.user._id,
                //         username:req.user.username
                //     }
                // });

//                 newLeave.save();
//                     // .then(user=>{
//                     //     // const username=String(req.user.username);
//                     //     // newLeave.user.update({$push: {id:usid,username:username}});
//                     //     //await User.replaceOne({ usid }, { leave: newLeave });
//                     //     //user.update({$push: {leave:newLeave}})
//                     //     //User.updateOne({id: user._id}, {$push: {"leaves": newLeave}});
//                     //     //User.leaves.push(newLeave);
//                     //     //db.User.update()

//                     //     //user.leaves.push(newLeave);

//                     //     // user.save(done);
//                     //     // req.flash('success_msg','Applied successfully for leave');
//                     //     // res.redirect('/dashboard');
//                     // });
                
//                 // user.leaves.push(newLeave);
//                 // user.save();
                

//                 // date = new Date(req.body.leave.from);
//                 // todate = new Date(req.body.leave.to);
//                 // year = date.getFullYear();
//                 // month = date.getMonth() + 1;
//                 // dt = date.getDate();
//                 // todt = todate.getDate();

//                 // if (dt < 10) {
//                 // dt = "0" + dt;
//                 // }
//                 // if (month < 10) {
//                 // month = "0" + month;
//                 // }
//                 // console.log(todt - dt);
//                 // req.body.leave.days = todt - dt;
//                 // console.log(year + "-" + month + "-" + dt);
//                 // // req.body.leave.to = req.body.leave.to.substring(0, 10);
//                 // console.log(req.body.leave);
//                 // // var from = new Date(req.body.leave.from);
//                 // // from.toISOString().substring(0, 10);
//                 // // console.log("from date:", strDate);
//                 // Leave.create(req.body.leave, (err, newLeave) => {
//                 //     if (err) {
//                 //         req.flash("error", "Something went wrong");
//                 //         res.redirect("/dashboard");
//                 //         console.log(err);
//                 //     } else {
//                 //         newLeave.user.id = req.user._id;
//                 //         newLeave.user.username = req.user.username;
//                 //         console.log("leave is applied by--" + req.user.username);

//                 //         // console.log(newLeave.from);
//                 //         // newLeave.save();

//                 //         // user.leaves.push(newLeave);

//                 //         // user.save();
//                 //         // req.flash("success_msg", "Successfully applied for leave");
//                 //         // res.render("dashboard", { user : user});
//             }
//             user.leaves.push(newLeave);
//             user.save(done);
//             req.flash('success_msg','Applied successfully for leave');
//             res.redirect('/dashboard');
//             //     });
//             // }
//         });
// });




router.post("/users/:id/apply", (req, res) => {
    console.log(req.body);
    const us_id = req.params.id;
    if(req.body.subject!=''&&req.body.from!=''&&req.body.to!=''){
        console.log('No errors');
        const sub = String(req.body.subject);
        const fromdt = new Date(req.body.from);
        const todt = new Date(req.body.to);
        const days = todt.getDate()-fromdt.getDate();
        User.findById(us_id,(err,user)=>{
            if(err){
                req.flash('error','Something went wrong');
                console.log(err);
                res.redirect('/users/:id/apply');
    
            }
            else{
                const us_name = user.name;
                console.log(us_name);
                const us_details = { id : us_id , username : us_name};
                const applyLeave = new Leave({
                    subject : sub,
                    from : fromdt,
                    to : todt,
                    days : days
                });
    
                applyLeave.user.id = req.user._id;
                applyLeave.user.username = req.user.name;
    
                applyLeave.save();
    
                console.log(applyLeave);
    
                //user.leaves = [applyLeave._id];
                user.leaves.push(applyLeave);
                user.save();
                console.log(user);
            }
        });
        console.log(req.user);
        req.flash('success_msg','Successfully aplied for leave');
        // res.render('dashboard_student',{user : req.user});
        res.redirect('/dashboard');
    }
        
    else{
        console.log('Error');
        req.flash('error_msg','Some fields are missing');
        res.redirect('apply');
        // User.findById(us_id,(err,user)=>{
        //     if(err){
        //         console.log(err);
        //         req.flash('error','Unexpected error!');
        //         res.redirect('/dashboard');
        //     }
        //     res.render('apply',{user : user});
        // });
    }

  });
  


router.get('/users/:id/track',(req,res)=>{
    User.findById(req.params.id)
        .populate("leaves")
        .exec((err,user)=>{
            if(err){
                req.flash('error','no record found');
                res.redirect('/dashboard');
            }
            else{
                res.render('trackLeave',{user:user , moment:moment});
            }
        });
});

router.get('/users/:id/profile' , (req,res)=>{
    User.findById(req.params.id , (err,user)=>{
        if(err)
            console.log(err);
        else
            res.render('profile',{user : user});
    });
});

// router.get('/users/<%= user._id%>/track' , (req,res)=>{
//     User.findById(req.params.id , (err,user)=>{
//         if(err)
//             console.log(err);
//         else
//             res.render('trackLeave',{user : user});
//     });
// })

//hod handles
router.get('/users/:id/Leaves',(req,res)=>{
    //hod
    User.findById(req.params.id , (err,hod)=>{
        if(err){
            console.log(err);
            req.flash('error','Something went wrong');
            res.redirect('dashboard_hod');
        }
        else{
            //Student of same department requesting leave
            // User.find({user_type : 'Student'} ,{department : hod.department})
            User.find({department : hod.department})
                .populate('leaves')
                .exec((err,students)=>{
                    if(err)
                        console.log(err);
                    else{
                        res.render('leave_requests',{user:hod , students:students , moment:moment});
                    }
                })
        }
    });
});

router.get('/users/:id_user/leaves/:id_stud/more_info' , (req,res)=>{
    //Hod
    User.findById(req.params.id_user , (err,hod)=>{
        if(err){
            console.log(err);
            req.flash('error','Something went wrong');
            res.redirect('/users/:id/Leaves');
        }
        else{
            //Student(more_info)
            User.findById(req.params.id_stud)
                .populate('leaves')
                .exec((err,student)=>{
                    if(err)
                        console.log(err);
                    else{
                        res.render('more_info' , {user:hod , student:student , moment:moment});
                    }
                })
        }
    });
});

//Leave approval/denial
router.post('/users/:id_user/leaves/:id_stud/more_info' , (req,res)=>{
    //Hod
    User.findById(req.params.id_user , (err,hod)=>{
        if(err)
            console.log(err);
        else{
            //Student(more_info)
            User.findById(req.params.id_stud)
                .populate('leaves')
                .exec((err,student)=>{
                    if(err)
                        console.log(err);
                    else{
                        if(req.body.action=="Approve"){
                            student.leaves.forEach(leave => {
                                if(leave.status=="pending"){
                                    leave.status="approved";
                                    leave.approved=true;
                                    leave.save();
                                    req.flash('success_msg','Leave Application Approved');
                                }
                            });
                        }
                        else{
                            student.leaves.forEach(leave => {
                                if(leave.status=="pending"){
                                    leave.status="denied";
                                    leave.approved=false;
                                    leave.save();
                                    req.flash('success_msg','Leave Application Denied');
                                }
                            });
                        }
                        res.render("more_info" , {moment:moment , user : hod , student : student});
                    }
                });
        }
    });
});

router.get('/users/:id/edit',(req,res)=>{
    User.findById(req.params.id)
    .exec((err,user)=>{
        if(err){
            console.log(err);
        }
        else{
            User.findById(req.params.id)
            .exec((err,user)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.render('edit' , {user:user,name:user.name,email:user.email,department:user.department,url:user.url});
                }
            });
        }
    });
})

router.post('/users/:id/edit',(req,res)=>{
    const{name,email,department,url}=req.body;
    User.findById(req.params.id)
    .exec((err,user)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            const password=user.password;
            const type=user.user_type;
            const leaves=user.leaves;
            const date=user.date;
            user.overwrite({user_type:type,name:name,email:email,department:department,password:password,date:date,leave:leaves,url:url});
            user.save();
        }
    })
    req.flash('success_msg','Changes saved');
    res.redirect('/dashboard');
});

module.exports = router;