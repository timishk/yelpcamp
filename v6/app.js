var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var localStrategy=require("passport-local");
var nodemailer = require('nodemailer');
var request = require('request');
mongoose.connect("mongodb://localhost/yelp_camp");
var Campground=require("./models/campground");
var Comment=require("./models/comment")
var User=require("./models/user");
var seedDB=require("./seeds");
var indexRoutes=require("./routes/index");
var commentRoutes=require("./routes/comment");
var campRoutes=require("./routes/campground");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
//seedDB();

app.use(require("express-session")({
	secret:"jo man hai kar",
	resave:false,
	saveUninitialized:false
}))
app.use (passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
})
app.use(indexRoutes);
app.use(commentRoutes);
app.use(campRoutes);
app.listen(3000,function(){
	console.log("yelpcamp started");
})