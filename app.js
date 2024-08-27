const express = require("express");
const {db_connect} = require("./database/dbHelper")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const {authenticated, injectUser} = require("./middlewares/middleware");
const everyMinute = require("./services/cronService")
const userRouter= require("./routers/userRouters");
const authRouter = require("./routers/authRouters");
const productRouter = require("./routers/productRouters");


const app = express();

app.set("port", 3000);
const Token = "My-Secret-key";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use("/static", express.static(`${__dirname}/publics`));
app.set("view engine", "ejs");
dotenv.config();

const maxAge = process.env.Token;

app.use("*", injectUser);

app.get("/",(req,res)=>{
    // res.send("Welcome to Nodemon Express!!")
    res.render("home",{welcomeString:"hhhh" ,page_title:"Home"});
});


app.use("/",authRouter);

app.use("/",userRouter);
// app.get("/users", userRouter);

app.get("/set-cookie", (req,res)=>{
    // res.setHeader("Set-Cookie", "test-cookie=test-data");

    res.cookie("test-cookie", "test cookie value", {maxAge: 1000*60*60*24, httpOnly:true});
    
    res.send("You've got the cookie");
})

app.get("/get-cookie", (req, res)=>{
    let cookies = req.cookies;
    res.json({cookies})
    console.log(req.cookies);
    res.json(req.cookies)
});

app.get("/get-token", (req,res)=>{
    let payload ={
        id:123
    };
    let token = jwt.sign(payload,process.env.Token);
    res.send({token});
})

app.post("/test-token",(req,res)=>{
    let test_token = req.body.token;
    jwt.verify(test_token,process.env.Token,(err, payload)=>{
        if(err){
            res.send({message:"You Suck"});
            return;
        }
        res.send({payload});
    })
    })

app.use("/", productRouter);

db_connect().then(()=>{
    app.listen(app.get("port"),()=>{
        console.log(`Server is up and running at localhost:${app.get("port")}`);
    });
}).catch(err=>{
    console.log("Can't connect to db. Can't start ther server.");
});

app.get("/run-job", (req, res) => {
    everyMinute.fireOnTick();
    res.status(200).json({
        data: "running"
    })
})

