var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;

var config = require("./config");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
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
            var currentUser = req.user;
            res.render("campgrounds/index", {
                campgrounds,
                currentUser
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
    res.render("campgrounds/new");
});
// Shows more info about the campground
app.get("/campgrounds/:id", (req, res) => {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log("not found and " + err);
        } else {
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });

});

//===================//
//Comment section
//===================//

app.get("/campgrounds/:id/comments/new",isLoggedIn, (req, res) => {
    //find campground by id and send it to new form
    var id = req.params.id;
    Campground.findById(id, (err, campground) => {
        if (err) {
            console.log("hell");
        } else {
            res.render("comments/new", {
                campground
            });
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn,(req, res) => {
    //loopup campground using id
    console.log(req.body.comment);
    var id = req.params.id;
    Campground.findById(id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    //create a new comment
    //connect new commnet to campground
    //redirect to camground show page
});

//===========
//Auth routes==========
//show register form
app.get("/register", (req, res) => {
    res.render("register");
});

//Post route for Usr registration
app.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username
    });
    console.log("hi" + newUser);
    User.register(newUser, req.body.password, (err, usre) => {
        if (err) {
            console.log(err);
            return res.render("./register");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("campgrounds");
            });
        }
    });
});

//login routes
//show to login form
app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
});

app.get("/logout",(req,res) =>{
    req.logout();
    res.redirect("/campgrounds");
});

//Authorization middlewire

function isLoggedIn (req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/login");
}

app.listen(config.port, () => {
    console.log("Server is on Port " + config.port);
});