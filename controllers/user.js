const User=require("../models/user.js");

module.exports.getsignupuser=(req,res)=>{
    res.render("users/signup.ejs");
  };

  module.exports.postsignupuser=async(req,res)=>{
    try{
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    //automatic login setup
    req.login(registeredUser,(err)=>{
      if(err){
        next(err);
      }
      req.flash("success","You are now signed up!!")
      res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.getloginuser=(req,res)=>{
    res.render("./users/login.ejs");
  };

  module.exports.postloginuser=async(req,res)=>{
    req.flash("success","welcome to wonderlust! You are logged in ");
    let redirecturl=res.locals.redirectUrl||"/listings"
    res.redirect(redirecturl);
   
   };

   module.exports.logoutuser=(req,res)=>{
    req.logout((err)=>{
    if(err){
      console.log("hii eroor hai");
      return next(err);
      
    }
    req.flash("success","You are logged out Now!!");
    res.redirect("/listings");
  })
    };