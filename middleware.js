const Listing = require("./models/listing");
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema, reviewSchema}=require('./schema.js');
const Review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>
{   
    console.log(req.user);
    if(!req.isAuthenticated()) { //passport method to check user is authenticated(signed in or not).
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','You must be logged in to create listing');
        res.redirect('/user/login');
      }
      next();
}

//we are creating another middleware to store the path at which the person is asked to login , because we want to redirect the client to that path after login.
//passport automatically resets the req.session value once it goes in login path. So we are storing the path inside a local which is accessable anywhere.
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectedUrl=req.session.redirectUrl;
  }
  next();
}

//authentication
module.exports.isOwner=async(req,res,next)=>{
  let {id}= req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id))
  {req.flash('error',"You don't have permit");
   return res.redirect('/listings'); //return is cumpolsary otherwise the operations below the if block will execute
  }
  next();
}

module.exports. validateListing=(req,res,next)=>{
  //result will check if any wrong data is entered in the database. It  uses joi.
  let result=listingSchema.validate(req.body); 
  console.log(result);
  //if there will be error, we can throw an error
  if(result.error){
   throw new ExpressError(400,result.error)
  }
  else{
     next();
  }
}

//server side validation for reviews using joi (in schema.js)
module.exports.validateReview=(req,res,next)=>{
    //result will check if any wrong data is entered in the database using joi.
    let result=reviewSchema.validate(req.body);  
    //if there will be error, we can throw an error
    if(result.error){
     throw new ExpressError(400,result.error)
    }
    else{
       next();
    }
};

//review authentication
module.exports.isAuthor=async(req,res,next)=>{
  let {id,reviewId}= req.params;
  console.log(Review.author);
  let review=await Review.findById(reviewId );
  if(!review.author.equals(res.locals.currUser._id))
  {req.flash('error',"You don't have permit to delete the review");
   return res.redirect(`/listings/${id}`); //return is cumpolsary otherwise the operations below the if block will execute
  }
  next();
}