const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
  {
    req.session.redirecturl=req.originalUrl;
    req.flash("error","You are not reigistered user , You must be logged in!");
    res.redirect("/login");
  }
  else{
  next();
  }
};

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirecturl)
  {
    res.locals.redirectUrl=req.session.redirecturl;
  }
  next();
};

module.exports.isOwner=(async(req,res,next)=>{
  let {id}=req.params;
   
  let listing=await Listing.findById(id);
  if(res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)){
    console.log("hey i am inside")
    req.flash("error","You dont have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
});

module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
      let errmsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errmsg);
    }
      else{
        next();
      }
  };

  module.exports.validatereview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
      let errmsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errmsg);
    }
      else{
        next();
      }
  };

  module.exports.isReviewAuthor=(async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    let curruser=res.locals.currUser||0;
    console.log(curruser,"value");
    //console.log(res.locals.currUser,"currentuser");
    //console.log(review.author,"author",res.locals.currUser._id,"curr user");
    if( !review.author.equals(curruser._id)){
      req.flash("error","You don't have permission to delete the reviews");
      return res.redirect(`/listings/${id}`);
    }
    next();

  });