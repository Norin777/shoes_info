const { User }= require("../models/UserModel")
const bcrypt = require("bcrypt");
const {createToken, handleErr} = require("../helpers/helpers");

module.exports.registerGet = function(req, res){
    res.render("register", {
        page_title:"Register"
    });
}
module.exports.loginGet = function(req, res){
    res.render("login", {
        page_title:"Login"
    });
}
module.exports.loginPost = async function(req, res){
    let email = req.body.email;
    let password = req.body.password;
    let user = await User.findOne({email});
    if(!user){
        res.status(404).json({
            "errors":{
                "email":"email not found"
            }
        });
        return;
    }
    // console.log(password + " | "+user.password)
    let check_password = await bcrypt.compare(password, user.password);
    if(!check_password){
        res.status(400).json({
            errors:{
                "password":"wrong password"
            }
        });
        return;
    }
    let token = createToken(user.id);
    res.cookie("_token", token,{
        maxAge: 1000*60*60*24
    });
    res.status(200).json({
        "data":"ok"
    });
}

module.exports.logout = function (req, res){
    res.clearCookie("_token");
    res.redirect("/");
}