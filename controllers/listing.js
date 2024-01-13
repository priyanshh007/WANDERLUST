const Listing=require("../models/listing");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});


module.exports.index=async(req,res,next)=>{
    const  allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
 };

 module.exports.renderNewForm= (req,res)=>{
        res.render("./listings/new.ejs");
      };

module.exports.showlisting=async (req,res)=>{
    let {id}=req.params;
    console.log(id);
    
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error","lisitng you requested doesnt exist!!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createlisitng=async(req,res,next)=>
{ 
  let response=await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1, 
  })
    .send();



let url=req.file.path;
let filename=req.file.filename;
const  newListing=new Listing(req.body.listing);
console.log(req.body.listing);
newListing.owner=req.user._id;
newListing.image={url,filename};

newListing.geometry=response.body.features[0].geometry;

let savedListing=await newListing.save();
console.log(savedListing);
  req.flash("success","New lisitng  created !");
  res.redirect("/listings");
};

module.exports.renderEdit=async(req,res)=>
{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","lisitng you requested doesnt exist!!");
      res.redirect("/listings");
    }
    
     res.render("listings/edit.ejs",{listing});
};
    
module.exports.updatelisting=async(req,res)=>{
    let {id}=req.params;
    let updatedListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(req,"--body");
    console.log(typeof req.file,"--file");
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    updatedListing.image = { url, filename };
   await updatedListing.save();
}
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
 };

 module.exports.destroylisting=async(req,res)=>{
    let {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    console.log("deleted listing");
    console.log(deletedListing);
    req.flash("success"," lisitng  deleted sucessfully!");
    res.redirect("/listings");
  };