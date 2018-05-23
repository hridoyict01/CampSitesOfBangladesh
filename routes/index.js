var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//Root route
router.get("/", (req, res) => {
    res.render("landing");
});

//===========
//Auth routes==========
//show register form
router.get("/register", (req, res) => {
    res.render("register");
});

//Post route for Usr registration
router.post("/register", (req, res) => {
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
router.get("/login", (req, res) => {
    res.render("login");
});

//Login form logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
});
//logout route
router.get("/logout",(req,res) =>{
    req.logout();
    res.redirect("/campgrounds");
});

//Authorization middleware

function isLoggedIn (req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;