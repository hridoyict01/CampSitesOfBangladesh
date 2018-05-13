var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var config = require("./config");


mongoose.connect("mongodb://localhost/yelp_camp",(err) =>{
    if(err) {
        console.log("Error accours"+err);
    } else {
        console.log("successful");
    }
});
var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Schema set up

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Zadipai", 
//     image: "http://www.photosforclass.com/download/pixabay-3369328?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fea36b7062bf6093ed1584d05fb1d4e97e07ee3d21cac104497f6c07caeefb2b0_960.jpg&user=Valeria65244"
// }, (err, campground) =>{
//     if(err) {
//         console.log("Fucked up");
//     } else {
//         console.log("congratulations");
//         console.log(campground);
//     }
// });




app.get("/", (req,res) => {
    res.render("landing");
});

app.get("/campgrounds", (req,res) => {
    // res.render("campgrounds",{campgrounds});
    //Get all campgrounds from db
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log("Error bro");
        } else {
            console.log("Fuck you bro..you are great");
            console.log(campgrounds);
            res.render("campgrounds",{campgrounds});
        }
    });
    // Pass them to the view
});

app.post("/campgrounds", (req,res) => {
    
    var name = req.body.name;
    var image = req.body.image;
    var campground = {name,image};
    campgrounds.push(campground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req,res) => {
    res.render("new.ejs");
});


app.listen(config.port, () => {
    console.log("Server is on Port "+config.port);
})