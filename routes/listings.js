const express= require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');
const listingController=require('../controllers/listings.js');
const multer=require('multer');
const {storage}= require('../cloudConfig.js')
const upload= multer({storage});

//router.route is used to group all the requests on common route
router
.route('/')
//index route
.get( wrapAsync(listingController.index ))
//create route
.post( isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.create));

//trending route
router.get('/Trending',wrapAsync(listingController.trending));

//search route
router.get('/search',wrapAsync(listingController.search))
//delete route
router.delete('/:id',isLoggedIn, isOwner, wrapAsync( listingController.delete));


//new route  it will be above show route as if show is above it then the browser will think it as an id
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('listings/new.ejs');
});
router.
route('/:id')
//show route
.get(wrapAsync(listingController.show))
//update route
.put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.update));


//edit route
router.get('/:id/update',isLoggedIn,isOwner, wrapAsync( listingController.edit));


//category route
router.get('/category/:cat',wrapAsync(listingController.category));

module.exports= router;