const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");

// Render Signup Form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Signup
router.post("/signup", async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({
            email,
            username,
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to StayFinder!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

// Render Login Form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Login
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome Back!");
        res.redirect("/listings");
    }
);

// Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "Logged Out Successfully!");
        res.redirect("/listings");
    });
});

module.exports = router;