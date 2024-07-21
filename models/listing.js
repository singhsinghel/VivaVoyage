const mongoose=require('mongoose');
const Review = require('./review');
const User= require('./user');
const { ref } = require('joi');
const  schema = mongoose.Schema;

const listingSchema=schema(   { 
    title:{
        type:String,

    },
    description:{
        type:String,
        required:true
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    review:[{
        type:schema.Types.ObjectId,
        ref:'Review'
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    category:{
        type:String,
        enum:['Trending','Rooms','Iconic-cities','Nature','Castles','Amazing-pools','Camping','Farms','Arctic','Foreign'],
    },
});

listingSchema.post('findOneAndDelete',async (listing)=>{
    if(listing){
     await Review.deleteMany({_id:{$in:listing.review}});
 
    }
 });

const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;


