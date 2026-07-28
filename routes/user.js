const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const { saveRedirect } = require("../middleware");

// Signup Form
router.get("/signup", (req, res) => {
    res.render("users/signup");
});

// Signup
router.post("/signup", saveRedirect,async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email,
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

// Login Form
router.get("/login", (req, res) => {
    res.render("users/login");
});

// Login
router.post(
    "/login",
    saveRedirect,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");

        const redirectUrl = res.locals.redirectUrl || "/listings";

        delete req.session.redirectUrl;

        res.redirect(redirectUrl);
    }
);

// Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
});

module.exports = router;