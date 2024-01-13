const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const{validatereview,isLoggedIn,isReviewAuthor,saveRedirectUrl}=require("../middleware.js");
const reviewcontroller=require("../controllers/review.js")


  //Reviews
  //posting review
  router.post("/",isLoggedIn,validatereview,wrapAsync(reviewcontroller.postingreview));

//DELETE REVIEW ROUTE

router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewcontroller.destroyreview));

module.exports=router;


