const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
const { application } = require("express");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

//Database ke connection ki call 
main().then(()=>{
    console.log("connnected to DB");
})
.catch((err)=>{
    console.log(err);
});



//Database k liee function
async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB=async()=>
{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"65441f41edd7c20d43d80baa"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};

initDB();

