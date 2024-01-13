const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const listingController=require('../controllers/listing.js');


const listings=require("../routes/listing.js");
const {isLoggedIn,saveRedirectUrl,isOwner,validateListing,validatereview}=require("../middleware.js");

const multer =require('multer');

const{storage}=require("../cloudconfig.js");

const upload = multer({storage});




//Here we used router.route method
router.route("/")
//index route  
.get(wrapAsync(listingController.index))
 //create route
 /*.post(saveRedirectUrl,validateListing,wrapAsync(listingController.createlisitng));*/
 .post(
  isLoggedIn,
  upload.single("listing[image]"),
 wrapAsync(listingController.createlisitng));

 //New route
router.get("/new",isLoggedIn,listingController.renderNewForm);


 router.route("/:id")
 //show route
.get(wrapAsync(listingController.showlisting))
//Update Route
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updatelisting))
  //DELETE ROUTE
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroylisting));




//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEdit));


  module.exports=router;