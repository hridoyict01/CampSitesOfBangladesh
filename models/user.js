var mongssose = require("mongoose");
var passportLocalMOngoose = require("passport-local-mongoose");

var userSchema = new mongssose.Schema({
    username: String,
    password: String
});
userSchema.plugin(passportLocalMOngoose);
module.exports = mongssose.model("User", userSchema);