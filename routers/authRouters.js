const express = require("express");
const {registerGet, loginGet, loginPost, logout} = require("../controllers/authControllers");
const authRouter = express.Router();

authRouter.get("/register", registerGet)

authRouter.get("/login", loginGet)

authRouter.post("/login", loginPost)
authRouter.get("/logout", logout);

module.exports = authRouter;