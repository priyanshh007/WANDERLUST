if(!process.env.NODE_ENV !="production"){
  require('dotenv').config();
}
const express=require("express");
const MongoStore = require('connect-mongo');
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapasync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");


const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const user=require("./routes/user.js")


const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const { error } = require('console');



const dbUrl=process.env.ATLASDB_URL;
//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

//Database ke connection ki call 
main()
.then(()=>
{
    console.log("connnected to DB");
})
.catch((err)=>
{
    console.log(err);
});


//Database k liee function
async function main(){
     await mongoose.connect(dbUrl);
};



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use (express.static(path.join(__dirname,"/public")));


const store=MongoStore.create(
  {
    mongoUrl:dbUrl,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,
  }
);
store.on("error",()=>{
  console.log("ERROR IN MONGO STORE",error);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true
  }
};

app.use(session(sessionOptions));
app.use(flash());

//implementation of passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





//middleware ki tyyari
app.use((req,res,next)=>{
 res.locals.success=req.flash("success");
 res.locals.error=req.flash("error");
 res.locals.currUser = req.user;
 next();
});
app.get("/demouser",async(req,res)=>{
  let fakeUser = new User({
    email:"studentt@gmail.com",
    username:"delta-studentt"
  });
  let registeredUser=await User.register(fakeUser,"helloworld");
  res.send(registeredUser);
});

app.use("/",listings);

app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);
 
app.use("/",user);

  //Error handling
  app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
  });

  app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wromg"}=err;
    res.status(statusCode).render("error.ejs",{message});
                              });


                              
//Port
app.listen(1010,()=>{
    console.log("serever is listening on port 1010");
});