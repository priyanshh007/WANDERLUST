const mongoose=require("mongoose");
const Schema=mongoose.Schema; 
const Review=require("./review.js");


const listingSchema=new Schema({
   title: {
    type:String,
          },

   description: String,

   image:{
    filename:String,
    url:String,
    },
   price:
   {
    type: Number,
    default:0,
   },
   location: String,
   country: String,
   reviews:[
      {
         type:Schema.Types.ObjectId,
         ref:"Review",
      },
   ],
   owner: {
      type:Schema.Types.ObjectId,
      ref:"User",
   },
   geometry: {
      type: {
         type: String, // Don't do `{ location: { type: String } }`
         enum: ['Point'], // 'location.type' must be 'Point'
         required: true
       },
       coordinates: {
         type: [Number],
         required: true
       }
   }

});

listingSchema.post("findOneAndDelete",async(lisitng)=>{
   if(lisitng){
   await Review.deleteMany({_id:{$in: lisitng.reviews}});
   }
});


const  Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;