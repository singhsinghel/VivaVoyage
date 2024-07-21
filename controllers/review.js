const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.create=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);

    
    newReview.author=req.user;
    console.log(req.user.username);

    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success','Review posted');
    res.redirect(`/listings/${listing._id}`);
}

module.exports.delete= async(req,res)=>{
    let {id,reviewId}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review deleted')
    res.redirect(`/listings/${id}`);
}