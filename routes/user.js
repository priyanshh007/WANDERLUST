const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapasync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const usercontroller=require("../controllers/user.js");



router.get("/signup",usercontroller.getsignupuser);

router.post("/signup",wrapAsync(usercontroller.postsignupuser));

router.get("/login",usercontroller.getloginuser);

  router.post("/login",saveRedirectUrl,passport.authenticate("local", { failureRedirect: '/login', failureFlash:true,
  }),usercontroller.postloginuser);

  router.get("/logout",usercontroller.logoutuser);




module.exports=router;