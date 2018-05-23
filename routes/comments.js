
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//===================//
//Comment section
//===================//

//Comments new

router.get("/campgrounds/:id/comments/new",isLoggedIn, (req, res) => {
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
//comments create
router.post("/campgrounds/:id/comments", isLoggedIn,(req, res) => {
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
//Authorization middleware

function isLoggedIn (req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;