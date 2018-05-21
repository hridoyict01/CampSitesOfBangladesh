var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var config = require("./config");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
//Connect with mongdb
mongoose.connect("mongodb://localhost/yelp_camp", (err) => {
    if (err) {
        console.log("Error accours" + err);
    } else {
        console.log("successful");
    }
});
seedDB();

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    // res.render("campgrounds",{campgrounds});
    //Get all campgrounds from db
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log("Error bro");
        } else {
            res.render("index", {
                campgrounds
            });
        }
    });
    // Pass them to the view
});

app.post("/campgrounds", (req, res) => {

    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var campground = {
        name,
        image,
        description
    };
    Campground.create(campground, (err, campground) => {
        if (err) {
            console.log("Failed");
        } else {
            res.redirect("/campgrounds");
        }
    });

});

app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
});
// Shows more info about the campground
app.get("/campgrounds/:id", (req, res) => {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log("not found and " + err);
        } else {
            res.render("show", {
                campground: foundCampground
            });
        }
    });

});


app.listen(config.port, () => {
    console.log("Server is on Port " + config.port);
});