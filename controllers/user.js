const User = require("../models/user");

module.exports.loginRouter = (req, res) => {
        req.flash("success", "Welcome back!");

        const redirectUrl = res.locals.redirectUrl || "/listings";
        console.log("Redirect URL:", redirectUrl);
        delete req.session.redirectUrl;

        res.redirect(redirectUrl);
};

module.exports.signupRouter = async (req, res, next) => {
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
};

module.exports.logoutRouter = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};

module.exports.loginFormRender = (req, res) => {
    res.render("users/login");
}

module.exports.signupFormRender = (req, res) => {
    res.render("users/signup");
};