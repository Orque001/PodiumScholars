const path = require("path");
const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;

const db = require("../config/database");
const res = require("express/lib/response");

const { errorPrint, successPrint } = require('../helpers/debug/debugprinters');
const UserError = require('../helpers/error/UserError');
const { registerValidation, loginValidation } = require('../middleware/validation');
const UserModel = require('./users');
const { isLoggedIn } = require("../middleware/routeProtectors");

async function getCurrentUser(){
    let baseSQL = "SELECT first_name, last_name FROM Users WHERE username=?";
    if (isLoggedIn = true) {
        const currUser = await db.promise().execute(baseSQL, [username])

        return currUser;
    }
}

dashModel.createBio = async (user_bio) => {
    const baseSQL = "INSERT INTO Users(user_bio) VALUES (?);";

    return db.promise().execute(baseSQL), [bio]

}