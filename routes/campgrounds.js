var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/campgrounds", (req, res) => {
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
//new camp adding page
router.get("/campgrounds/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});
//create campgrounds
router.post("/campgrounds", isLoggedIn, (req, res) => {

    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var campground = {
        name,
        image,
        description,
        author
    };
    Campground.create(campground, (err, campground) => {
        if (err) {
            console.log("Failed");
        } else {
            res.redirect("/campgrounds");
        }
    });

});

// Shows more info about the campground
router.get("/campgrounds/:id", (req, res) => {
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
//Edit campground route
router.get("/campgrounds/:id/edit",checkCampgroundOwnership, (req, res) => {
        var id = req.params.id;
        Campground.findById(id, (err, campground) => {
            res.render("campgrounds/edit", {campground});
        });
});
//Update campground route
router.put("/campgrounds/:id",checkCampgroundOwnership, (req, res) => {
    //find and update the campground
    var id = req.params.id;
    console.log(id);
    Campground.findByIdAndUpdate(id, req.body.campground, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            console.log(campground);
            res.redirect("/campgrounds/" + id);
        }
    });

    //redirect to show page
});

//Destroy campground route

router.delete("/campgrounds/:id",checkCampgroundOwnership, (req, res) => {
    var id = req.params.id;
    Campground.findByIdAndRemove(id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});
//cheack user ownershiop
function checkCampgroundOwnership(req,res, next) {
      //is user logged in
      if (req.isAuthenticated()) {
        var id = req.params.id;
        Campground.findById(id, (err, campground) => {
            if (err) {
                res.redirect("/campgrounds");
            } else {
                if(campground.author.id.equals(req.user._id) ){
                   next();
                } else {
                    res.redirect("back");
                }
            
            }
        });
    } else {
        res.redirect("back");
    }
}




//Authorization middlewire

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;