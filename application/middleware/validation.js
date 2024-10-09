const UserModel = require('../models/users');

//username validation checking that first psotion is a letter and that username is alphanumperic
const checkUsername = (username) => {
    const usernameRegex = new RegExp("^\\D\\w{2,}$");
    let usernameChecker = usernameRegex;
    return usernameChecker.test(username);
}
//password regex validation
const checkPassword = (password) => {
    const passRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[(\\/*-+!@#$^&*)]).{8,}$");
    let passwordChecker = passRegex;
    return passwordChecker.test(password);
}
//email regex validation
const checkEmail = (email) => {
    const emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$");
    let emailChecker = emailRegex;
    return emailChecker.test(email);
}

const checkLogin = async (username, password) => {
    const isValid = await UserModel.authenticate(username, password);
    console.log(isValid);
    return isValid;
}

//runs the regex validation for each part of registration.
const registerValidation = (req, res, next) => {

    let username = req.body.regUsername;
    let password = req.body.regPass;
    let email = req.body.regEmail;

    if (!checkUsername(username)) {
        req.flash('error', "invalid username!");
        console.log("username error");
        req.session.save(err => {
            res.redirect("/register");
        });
    } else if (!checkPassword(password)) {
        req.flash('error', "Invalid password!");
        console.log("password error");
        req.session.save(err => {
            res.redirect("/register");
        });
    } else if (!checkEmail(email)) {
        req.flash('error', "Invalid email!");
        console.log("email error");
        req.session.save(err => {
            res.redirect("/register");
        });
    } else {
        next();
    }
}

//checks that login username and password match to allow for login.
const loginValidation = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const userId = await checkLogin(username, password)
    if (userId <= 0) {
        console.log("bad username/pass");
        req.flash('error', "Invalid username or password! Please check your credentials and try again.");
        req.session.save(err => {
            res.redirect("/login");
        });
    } else {
        req.session.userId = userId;
        console.log("success");
        next();
    }
}
module.exports = { registerValidation, loginValidation }

