module.exports = {
    ensureAuthenticated : function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','You need to be logged in to view this page');
        res.redirect('/users/login')
    }
}


//we created this file to endsure that the user is not logged out before accessing the dashboard