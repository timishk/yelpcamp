var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment")
var User=require("../models/user");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
router.use(methodOverride("_method"));

router.get("/campgrounds/:id/comments/new",isLoggedIn ,function(req,res){
	Campground.findById(req.params.id,function(err,found){
		if(err)
			console.log(err)
		else
		{
		res.render("comments/new",{campground:found});	
		}
	})
	
})

router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campgroundFound){
		if(err)
			console.log(err)
		else
		{
			Comment.create(req.body.comment,function(err,comment){
				if(err)
					console.log(err)
				else
				{comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					campgroundFound.comments.push(comment);
					campgroundFound.save();
					res.redirect('/campgrounds/'+campgroundFound._id)
				}
			})
		}
	})

})

router.get("/campgrounds/:id/comments/:comment_id/edit",commentCheck,function(req,res){
    
     Comment.findById(req.params.comment_id,function(err,foundComment){
     	if(err)
     		res.redirect("back");
     	else
     		res.render("comments/edit",{campground_id:req.params.id,comment: foundComment});
     })
})

router.put("/campgrounds/:id/comments/:comment_id",commentCheck,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedBlog){
  	if(err)
  		res.redirect("back");
  	else
  		res.redirect("/campgrounds/"+req.params.id);
  })

})

router.delete("/campgrounds/:id/comments/:comment_id/delete",commentCheck,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err,Del){
		if(err)
			console.log(back);
		else
			res.redirect("/campgrounds/"+req.params.id);
	})
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function commentCheck(req,res,next){
 if(req.isAuthenticated()){
 	Comment.findById(req.params.comment_id,function(err,commentFound){
 		if(commentFound.author.id.equals(req.user._id)){
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