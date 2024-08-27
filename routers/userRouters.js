const express = require("express");

const { userPost, userGet ,getUserById} = require("../controllers/userControllers");
const userRouter = express.Router();


userRouter.post("/users", userPost);

userRouter.get("/users", userGet);

userRouter.get("/users/:id", getUserById);

module.exports=userRouter;
