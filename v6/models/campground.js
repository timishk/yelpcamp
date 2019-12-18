var mongoose=require("mongoose");


var campgroundSchema=new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	comments:[
        {
        	type:mongoose.Schema.Types.ObjectId,
        	ref:"Comment"
        }
	],
	created:{type:Date,default:Date.now},
	price:Number,
	address:String,
	state:String,
	city:String,
	country:String,
	author:{
		id:{
		type:mongoose.Schema.Types.ObjectId,
        	ref:"User"},
        	username:String
        }
        
	
});
module.exports=mongoose.model("Campground",campgroundSchema);