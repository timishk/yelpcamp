var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var mongoose=require("mongoose");
var expressSanitizer=require("express-sanitizer");
var methodOverride=require("method-override");
router.use(expressSanitizer());
router.use(methodOverride("_method"));
var nodemailer = require('nodemailer');
var request = require('request');

router.get("/campgrounds",isLoggedIn,function(req,res){
	Campground.find({},function(err,campgrounds){
		if(err)
			console.log(err);
		else
			{
                res.render("campground/campground",{campgrounds:campgrounds});}
	})
})

/*router.post("/campgrounds",function(req,res){
var name=req.body.name;
var image=req.body.image;
var desc=req.body.description;
var price=req.body.price;
var author={id:req.user._id,
	username:req.user.username
}
var newCampground={name:name,image:image,description:desc,price:price,author:author};
Campground.create(newCampground,function(err,campgrounds){
	if(err)
		console.log(err);
	else
		res.redirect("/campgrounds");

});

});*/

//my profile

router.post("/campgrounds", isLoggedIn, function(req, res) {
    //get data from form and add to thriftstore array
    request('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAPzLdcKEPCe4SQf3-cdSnq5vmh_MRaHCs' +

        '&address=' + encodeURIComponent(req.body.address),
        function(error, response, body) {
            if (error) {
                console.log('error!', error);
            } else {
                var data = JSON.parse(body);
                // console.log('data: ', util.inspect(data, { showHidden: false, depth: null }))

                if (data.results && data.results[0] && ["address_components"]) {
                    var addressComponents = data.results[0]["address_components"]
                    for (var i = 0; i < addressComponents.length; i++) {
                        if (
                            addressComponents[i]['types'].indexOf('sublocality_level_1') > -1 ||
                            addressComponents[i]['types'].indexOf('locality') > -1) {
                            var city = addressComponents[i]['long_name'];
                        }
                        if (addressComponents[i]['types'].indexOf('administrative_area_level_1') > -1) {
                            var state = addressComponents[i]['short_name'];
                        }
                        if (addressComponents[i]['types'].indexOf('country') > -1) {
                            var country = addressComponents[i]['long_name'];
                        }
                    }
                } else {
                    var city = null,
                        state = null,
                        country = null;
                }

                var camp = {
                    name: req.body.name,
                    image: req.body.image,
                    address: req.body.address,
                    city: city,
                    state: state,
                    country: country,
                    description:req.body.description,
                    price:req.body.price,
                    author: {
                        id: req.user._id,
                        username: req.user.username,
                     }
                };
                //redirect back to thriftfinder page
                //create a new thrift store and save to database
                
                Campground.create(camp, function(err, newlyCreated) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(newlyCreated);
                        res.redirect("/campgrounds");
                    }
                });
            }

        });

});


router.get("/campgrounds/new",isLoggedIn,function(req,res){
	res.render("campground/new.ejs");
});

router.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,campgroundFound){
		if(err)
		{
			console.log(err);
		}
		else
			{console.log(campgroundFound.created);
			res.render("campground/show",{campground:campgroundFound});}
	})
})

router.get("/campgrounds/:id/profile",isLoggedIn,function(req,res){
    console.log(req.params.id);
    var camps=[];
    Campground.find({},function(err,found){
        if(err)
            console.log(err);
        else{
            found.forEach(function(f){
                if(f.author.id.equals(req.params.id))
                   { console.log(f);
                camps.push(f);}
            })
            res.render("campground/mycamp",{camp:camps})
        }
    });
    });





router.get("/campgrounds/:id/edit",campgroundCheck,function(req,res){

	Campground.findById(req.params.id).populate("comments").exec(function(err,campgroundFound){
		if(err)
		{
			console.log(err);
		}
		else
			{
			res.render("campground/edit",{campground:campgroundFound});}
	})
})

router.put("/campgrounds/:id/edit",campgroundCheck,function(req,res){

req.body.camp.body=req.sanitize(req.body.camp.body);
	Campground.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updatedBlog){
		if(err)
			console.log(err)
		else
			res.redirect("/campgrounds/"+req.params.id);
	})
})

router.delete("/campgrounds/:id/delete",campgroundCheck,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err,Del){
		if(err)
			console.log(err);
		else
			res.redirect("/campgrounds");
	})
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function campgroundCheck(req,res,next){
 if(req.isAuthenticated()){
 	Campground.findById(req.params.id,function(err,campgroundFound){
 		if(campgroundFound.author.id.equals(req.user._id)){
 			next();
 		}
 		else
 			res.redirect("back");
 	})
 }
 else
 	res.redirect("back");
}
module.exports=router;