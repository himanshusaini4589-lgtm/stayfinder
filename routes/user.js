const express = require("express");
const router = express.Router();
const passport = require("passport");

const { saveRedirect } = require("../middleware");

const userController = require("../controllers/user");

// Signup Form
router.get("/signup", userController.signupFormRender);

// Signup
router.post("/signup", saveRedirect,userController.signupRouter);

// Login Form
router.get("/login", userController.loginFormRender);

// Login
router.post("/login",saveRedirect,passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}),userController.loginRouter);

// Logout
router.get("/logout", userController.logoutRouter );

module.exports = router;