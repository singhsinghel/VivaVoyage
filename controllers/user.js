
const User= require('../models/user.js');

module.exports.signup=async (req,res)=>{
    try {
       let{username,email,password}=req.body;
       const newUser=new User({
           username:username,
           email:email,
       });
     const registerdUser = await  User.register(newUser,password);
     res.locals.currUser=registerdUser;
     console.log(res.locals.currUser);
     req.login(registerdUser,(err)=>{
       if(err)
           next(err); 
       req.flash('success','Welcome to VivaVyouge');
       res.redirect('/listings');
     })
    } catch (error) {
        req.flash('error',error.message);
        
        res.redirect('/user/signup');
    }
   }

module.exports.login=async (req,res)=>{ 
    let{username}=req.body;
    req.flash('success',`Welcome back ${username}`);
    let redirect= res.locals.redirectedUrl || '/listings';
    res.redirect(redirect);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
         return next(err);
      }
      req.flash('success','You are logged out');
      res.redirect('/listings');
    })
  }