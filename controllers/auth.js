const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    let isLogged;
    if (req.get("Cookie")) {
        req.get("Cookie")
            .split(";")
            .map((p) => {
                if (p.includes("loggedIn=true")) {
                    return (isLogged = true);
                }
            });
    }

    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: isLogged,
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return res.redirect("/signup");
            }
            bcrypt.compare(password, user.password).then((isMatch) => {
                // console.log(isMatch);
                if (isMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.save((err) => {
                        if (err) {
                            console.log(err);
                        }
                        res.redirect("/");
                    });
                } else {
                    res.redirect("/login");
                }
            });
        })
        .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });
};

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then((userDoc) => {
            if (userDoc) {
                return res.redirect("/signup");
            }
            return bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] },
                    });
                    return user.save();
                })
                .then(() => {
                    res.redirect("/login");
                });
        })
        .catch((err) => console.log(err));
};
