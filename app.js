var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;

var config = require("./config");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//Requiring routes
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var commentRoutes = require("./routes/comments");

var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));
//Connect with mongdb
mongoose.connect("mongodb://localhost/yelp_camp", (err) => {
    if (err) {
        console.log("Error accours" + err);
    } else {
        console.log("successful");
    }
});
//Seed database 
// seedDB();

//passport configuration
app.use(require("express-session")({
    secret: "I love Bangladesh",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=================
//Send current user information to all the template

app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    next();
});


//Roter implementation
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(config.port, () => {
    console.log("Server is on Port " + config.port);
});