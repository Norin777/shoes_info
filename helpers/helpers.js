const jwt = require("jsonwebtoken");

module.exports.createToken = function(id){
    let payload = {id};
    let token = jwt.sign(payload, process.env.Token);
    return token;
}

module.exports.handleErr = function (err){
    errors = {}
    if(err.code == 11000){
        let path = Object.keys(Object.values(err)[0].keyPattern)[0]
        errors[path] = `${path} is already taken`;
        return errors;
    }
    if(err.message.includes("validation fail")){
        console.log(Object.values(err.errors))
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]= properties.message;
        })
        return errors;
    }
}