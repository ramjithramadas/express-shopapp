const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const mailer = nodemailer.createTransport(
    sgTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY,
        },
    })
);

exports.getLogin = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: message,
        oldInput: {
            email: "",
            password: "",
        },
        validationErrors: [],
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
            },
            validationErrors: errors.array(),
        });
    }

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                req.flash("error", "Email not found");
                return res.redirect("/login");
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
                    return res.status(422).render("auth/login", {
                        path: "/login",
                        pageTitle: "Login",
                        errorMessage: "Invalid email or password.",
                        oldInput: {
                            email: email,
                            password: password,
                        },
                        validationErrors: [],
                    });
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
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        errorMessage: message,
        oldInput: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationErrors: [],
    });
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        //console.log(errors.array());
        return res.status(422).render("auth/signup", {
            path: "/signup",
            pageTitle: "Signup",
            errorMessage: errors.array()[0].msg,
            oldInput: {
                name: name,
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword,
            },
            validationErrors: errors.array(),
        });
    }

    bcrypt
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
            return mailer.sendMail({
                to: email,
                from: process.env.EMAIL_FROM,
                subject: "Account created",
                text: "Your express shop account created successfully",
                html: `<b>Account created successfully at ${new Date()}</b>`,
            });
        })
        .catch((err) => console.log(err));
};

exports.getForgotPassword = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render("auth/forgot-password", {
        path: "/forgot-password",
        pageTitle: "Forgot Password",
        errorMessage: message,
    });
};

exports.postForgotPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect("/forgot-password");
        }
        const token = buffer.toString("hex");
        const email = req.body.email;
        console.log(token);
        User.findOne({ email: email })
            .then((user) => {
                if (!user) {
                    req.flash("error", `Oops!! No account found with ${email}`);
                    return res.redirect("/forgot-password");
                }
                user.passwordResetToken = token;
                user.passwordResetTokenExp = Date.now() + 3600000;
                return user.save();
            })
            .then(() => {
                return mailer.sendMail({
                    to: email,
                    from: process.env.EMAIL_FROM,
                    subject: "Reset Password",
                    text: "This email contains the link to reset your password",
                    html: `<p>Click this <a href="http://localhost:3001/reset-password/${token}">link</a> to set a new password.</p>`,
                });
            })
            .then(() => {
                req.flash("error", "Please check your email for reset link");
                return res.redirect("/forgot-password");
            })
            .catch((err) => console.log(err));
    });
};

exports.getResetPassword = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render("auth/reset-password", {
        path: "/reset-password",
        pageTitle: "Reset Password",
        errorMessage: message,
        token: req.params.token,
    });
};

exports.postResetPassword = (req, res, next) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const token = req.body.token;
    if (password !== confirmPassword) {
        req.flash("error", "Password did not match");
        return res.redirect(`/reset-password/${token}`);
    }
    let updatedUser;
    User.findOne({
        passwordResetToken: token,
        passwordResetTokenExp: { $gt: Date.now() },
    })
        .then((user) => {
            if (!user) {
                req.flash("error", "Something went wrong");
                return res.redirect(`/reset-password/${token}`);
            }
            updatedUser = user;
            return bcrypt.hash(password, 12);
        })
        .then((hashedPassword) => {
            updatedUser.password = hashedPassword;
            updatedUser.passwordResetToken = undefined;
            updatedUser.passwordResetTokenExp = undefined;
            return updatedUser.save();
        })
        .then(() => {
            return res.redirect("/login");
        })
        .catch((err) => console.log(err));
};
