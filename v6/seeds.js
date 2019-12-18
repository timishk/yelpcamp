var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

var data=[
{
	name:"jams",
	image:"https://cdn.pixabay.com/photo/2012/04/16/13/18/giraffe-35971_960_720.png",
	description:"beautiful"
},
{
	name:"jams",
    image:"https://cdn.pixabay.com/photo/2012/04/16/13/18/giraffe-35971_960_720.png",
    description:"lovely"
},
{
 	name:"ranchi",
    image:"https://cdn.pixabay.com/photo/2017/07/11/15/08/peacock-2493865__340.jpg",
    description:"dsncdsa"
},
{
	name:"jams",
	image:"https://cdn.pixabay.com/photo/2012/04/16/13/18/giraffe-35971_960_720.png",
	description:"beautiful"
}   
]

function seedDB(){
	Campground.remove({},function(err){
		if(err)
			console.log(err);
		else
			console.log("removed");

	/*	data.forEach(function(seed){
		Campground.create(seed,function(err,campground){
			if(err)
				console.log(err);
			Comment.create({text:"ncfwjinif",
		                    author:"rk"},function(err,comment){
		                    	if(err)
		                    		console.log(err)
		                    	else{
		                    	campground.comments.push(comment);
		                    	campground.save();}
		                    })

		})
	})*/
	})

}

module.exports=seedDB;