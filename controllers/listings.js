const Listing = require("../models/listing");

module.exports.index= async (req,res)=>{
    let listings= await Listing.find({})
      res.render('listings/index.ejs',{ listings});
};

module.exports.show=async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id).
    populate({
        path:'review',
        populate:{
            path:'author',
        }
    }).
    populate('owner'); 
    if(!listing){
        req.flash('error','Listing does not exists');
        res.redirect('/listings');
    }
    res.render('listings/show.ejs',{listing});
};

module.exports.create=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename; 
     const newListing= new Listing(req.body.listing);
     newListing.image={url,filename};
     newListing.owner=req.user._id;
     await newListing.save();
     req.flash('success','new listing created!');
     res.redirect('/listings');
};
module.exports.delete=async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete({_id:id});
    req.flash('success',' listing deleted!');
    res.redirect('/listings');
}

module.exports.edit=async (req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','Listing does not exists');
        res.redirect('/listings');
    }
    let orgImg=listing.image.url;
    orgImg.replace('/upload','/upload/w_200'); 
    res.render('listings/update.ejs',{listing,orgImg});
}

module.exports.update=async(req,res)=>{
    console.log(req.body);
    let {id}= req.params;
    if(!req.body.listing)
     throw new ExpressError(400,"send valid data for listing");
    if(req.file){
    let url=req.file.path;
    let filename=req.file.filename;
    
   let listing= await Listing.findByIdAndUpdate({_id:id},{...req.body.listing});
   listing.image={url,filename};
   await listing.save();
    req.flash('success','Listing Updated!')
    res.redirect('/listings'); 
    }
    else if(!req.file){
        let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
        await listing.save();
        req.flash('success','Listing Updated!')
        res.redirect('/listings'); 
    }
    else if(typeof req.file==='undefined')
    throw new ExpressError(400,"Upload Image");
}
module.exports.category=async (req,res)=>{
    let {cat}=req.params;
    let listings= await Listing.find({category:cat}) ;
    res.render('listings/index.ejs',{ listings});
    req.flash('success',`Showing results for ${cat}`);
}

module.exports.trending=async (req,res)=>{
    let listings=await Listing.find({});
    listings = listings.filter(listing => listing.review.length >= 2);
    res.render('listings/index.ejs',{ listings});
}

module.exports.search=async(req,res)=>{
    const {search}= req.query;
    if (!search) {
        req.flash('error','Enter something to search');
        res.redirect('/listings');
      }
    const regex = new RegExp(search, 'i'); 
    const searchFields = ['title', 'description', 'country','location']; 
    const searchConditions = searchFields.map(field => ({
    [field]: { $regex: regex }
    }));
    const listings=  await Listing.find({ $or:searchConditions});  
      console.log(listings);
      res.render('listings/index.ejs',{listings});
}