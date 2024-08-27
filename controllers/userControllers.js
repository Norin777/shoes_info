const {User}= require("../models/UserModel");
const {createToken, handleErr} = require("../helpers/helpers");

module.exports.userPost = async(req, res)=>{
    console.log(req.body)
    let newUser = User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save()
    .then(
        ()=>{
            let token = createToken(newUser.id);
            res.cookie("_token", token,{maxAge: 1000*60*60*24});
            res.status(201).json({
                id:newUser.id
            });
        }
    )
    .catch(
        err=>{
            let errors = handleErr(err)
            res.status(400).json({
                errors
            });
        }
    );
}

module.exports.userGet = async(req,res)=>{
    // let users = User.find();
    try{
        let users = await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({
            message: "Something went wrong."
        });
    }
}

module.exports.getUserById =async(req, res)=>{
    User.findById(req.params.id)
    .then(document=>{
        res.status(200).json(document)
    })
    .catch(err=>{
        res.status(404).json(
            {
                message: "Not Found"
            }
        );
    })
}