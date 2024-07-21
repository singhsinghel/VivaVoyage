const express= require('express');
const router=express.Router({mergeParams:true});
//mergeparams is used to merge the :id route to this file from app.js file. If not done, review.js cannot access :id

const wrapAsync=require('../utils/wrapAsync.js');
const { validateReview, isLoggedIn, isAuthor } = require('../middleware.js');
const { required } = require('joi');
const reviewController= require('../controllers/review.js')


// post route for reviews
//the common parts in routes can be removed. In both routes, common part is- listings/:id/review
router.post('/',
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.create));

// delete review route
router.delete('/:reviewId',isLoggedIn,isAuthor, wrapAsync(reviewController.delete));

module.exports=router;