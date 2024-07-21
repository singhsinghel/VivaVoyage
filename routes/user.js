const express= require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl, isLoggedIn } = require('../middleware.js');
const userController= require('../controllers/user.js');



router.route('/signup')
//create route
.get((req,res)=>{
    res.render('users/new.ejs');
})
.post(wrapAsync(userController.signup ));


router.
route('/login')
//login route(show route)
.get((req,res)=>{
    res.render('users/login.ejs');
})
.post(saveRedirectUrl,
passport.authenticate('local',
{failureRedirect:'/user/login',
failureFlash:true}),
userController.login  );


//logout route
router.get('/logout', userController.logout);

module.exports=router;
