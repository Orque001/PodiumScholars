const path = require("path");
const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;

const db = require("../config/database");
const res = require("express/lib/response");
const bcrypt = require('bcrypt');

const { errorPrint, successPrint } = require('../helpers/debug/debugprinters');
const UserError = require('../helpers/error/UserError');
const { registerValidation, loginValidation } = require('../middleware/validation');
const UserModel = require('../models/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//POST user listing.
router.post('/register', registerValidation, async (req, res, next) => {
    let username = req.body.regUsername;
    let email = req.body.regEmail;
    let password = req.body.regPass;
    let firstName = req.body.regFirstName;
    let lastName = req.body.regLastName;
    let confirmPassword = req.body.regConfirmPass;

    try {
        let usernameDoesExist = await UserModel.usernameExists(username);
        if (usernameDoesExist) {
            throw new UserError(
                "Registration Failed: Username already exists.",
                "/register",
                200
            );
        }

        let emailDoesExist = await UserModel.emailExists(email);
        if (emailDoesExist) {
            throw new UserError(
                "Registration Failed: Email already exists.",
                "/register",
                200
            );
        }

        let createdUserId = await UserModel.create(firstName, lastName, username, password, email);
        if (createdUserId < 0) {
            throw new UserError(
                "Server Error, user could not be created.",
                "/register",
                500
            );
        }

        successPrint("User.js --> User was created!");
        req.session.save(err => {
            res.redirect('/login');
            req.flash('success', 'User account has been made!');
        });
    } catch (err) {
        errorPrint("User could not be made", err);
        if (err instanceof UserError) {
            errorPrint(err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());
            req.flash('error', err.getMessage());
        } else {
            next(err);
        }
    }
});

//POSTS login
router.post('/login', loginValidation, async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    try {
        const loggedUserId = req.session.userId;
        if (loggedUserId > 0) {
            successPrint(`User ${username} is logged in`);

            req.session.username = username;
            req.session.userId = loggedUserId;
            res.locals.username = username;
            res.locals.firstName = await UserModel.getFirstName(loggedUserId);
            res.locals.lastName = await UserModel.getLastName(loggedUserId);
            res.locals.email = await UserModel.getEmail(loggedUserId);
            res.locals.logged = true;

            req.session.save(err => {
                res.redirect('/');
            });
            req.flash('success', 'You have been successfully logged in!');
        } else {
            throw new UserError("Invalid username and/or password.", "/login", 200);
        }
    } catch (err) {
        errorPrint("user login failed");
        if (err instanceof UserError) {
            errorPrint(err.getMessage());
            res.status(err.getStatus());
            res.redirect('/login');
            req.flash('error', err.getMessage());
        } else {
            next(err);
        }
    }
});

router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            errorPrint('session could not be destroyed.');
            next(err);
        } else {
            successPrint('Session was destroyed.');
            res.clearCookie('csid');
            res.json({ status: "OK", message: "user is logged out." });
        }
    })
});

module.exports = router;