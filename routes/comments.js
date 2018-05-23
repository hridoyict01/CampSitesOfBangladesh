
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
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
                    //add user name and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
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
//edit route
router.get("/campgrounds/:id/comments/:comment_id/edit", (req,res) =>{
    var campground_id = req.params.id;
    var comment_id = req.params.comment_id;
    Comment.findById(comment_id,(err,comment) =>{
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit",{campground_id, comment});
        }
    });
});
//Update comment
router.put("/campgrounds/:id/comments/:comment_id", (req, res) =>{
        var campId = req.params.id;
        var id = req.params.comment_id;
        Comment.findByIdAndUpdate(id, req.body.comment, (err, comment) =>{
            if(err) {
                res.send("failed");
            } else {
                console.log("Problme is here");
                res.redirect("/campgrounds/"+campId);
            }
            
        });
});
//Comments delete route
router.delete("/campgrounds/:id/comments/:comment_id", (req,res) =>{
    var id = req.params.comment_id;
    var campId = req.params.id;
    Comment.findOneAndRemove(id,(err) =>{
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            console.log("deleted");
            res.redirect("/campgrounds/"+campId);
        }
    });
});

//Authorization middleware

function isLoggedIn (req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;