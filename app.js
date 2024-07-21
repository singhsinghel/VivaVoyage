//We will create a new environment variable NODE_ENV after deployment and set it's value to production. Brlow conditiono shows 
//that the project is not deployed as the NODE_ENV value is not production
if(process.env.NODE_ENV !='production'){
    require('dotenv').config();
}
const express= require('express');
const app=express();
const mongoose=require('mongoose');
const cookieParser= require('cookie-parser');
const session= require('express-session');
const flash= require('connect-flash');
const passport= require('passport');
const LocalStrategy=require('passport-local');
const User= require('./models/user.js');
const mongoStore=require('connect-mongo'); //always require express-session first

//For overrideing methods in html forms as they only have get and post methods
const methodOverride=require('method-override');
app.use(methodOverride('_method'));

//A template to use a common boilercode or ejs code
const ejsMate=require('ejs-mate');
app.engine('ejs',ejsMate);

//Setting view engine as ejs
app.set('view engine','ejs');

//Too use public folder for styling and functionality
app.use(express.static('./public'));

//to get data from body of post request req.body
app.use(express.urlencoded({extended:true}));

//used to parse cookie . So that it can be accessed.
app.use(cookieParser());

const path=require('path');
app.set('views',path.join(__dirname,'/views')); 

const dbUrl=process.env.AT;
async function main(){
    await mongoose.connect(dbUrl);
}
main().then((res)=>{
    console.log(res);
});

app.listen(8080,()=>{
    console.log('app is listening');
});
 
const ExpressError=require('./utils/ExpressError.js');

const listingsRouter=require('./routes/listings.js');
const reviewRouter=require('./routes/review.js');
const userRouter=require('./routes/user.js');
const { error } = require('console');

const store=mongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});
store.on('error',()=>{
    console.log('Error in mongo session store');
})
//options for sessions
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +7*24*60*60*1000, //cookie will expire in one week
        maxAge:7*24*60*60*1000, 
        httpOnly:true,
    },
}

//middleware for sessions
app.use(session(sessionOptions));

//passport uses session so that the user doesn't need to login at each request.
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //to store the info regarding user in session.
passport.deserializeUser(User.deserializeUser()); //to unstore the info regarding user in session.

//flash
app.use(flash());

//middleware for flash. If any route has the following value, the following flash message will show.
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    //currUser is used to store the data of user to use it to show login,signin or logout button in ejs.
    res.locals.currUser=req.user;
    next();
});

//used for listing routes
app.use('/listings',listingsRouter);

//used for review routes
app.use('/listings/:id/review',reviewRouter);

//for user routes
app.use('/user',userRouter);


//used if the request didn't matches to any route, then this route will be called.
app.all('*',(req,res,next)=>{
    next( new ExpressError(404,"page not found"));
})

// middleware to handle error . Always put in in last.
app.use((err,req,res,next)=>{
    let {status=500,message='Error is occured'}=err;
    console.log(err);
    res.render('error.ejs',{status, message });
});
