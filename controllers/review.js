const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.postingreview=async(req,res)=>{
    //tha pr mongo ke code ke sath khelenge 
    let listing=await Listing.findById(req.params.id);

    //why its being called by req.body.review?? here
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New review saved");
    req.flash("success","Review created sucessfully!");
    res.redirect(`/listings/${listing._id}`);

};

module.exports.destroyreview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Review deleted sucessfully!");
    res.redirect(`/listings/${id}`);
  };