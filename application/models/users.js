const bcrypt = require('bcrypt');
const db = require('../config/database');

const UserModel = {};

//sql to create a new user in db
UserModel.create = async (firstName, lastName, username, password, email) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 15);
        const baseSQL = "INSERT INTO Users(first_name, last_name, username, user_email, password, created) VALUES (?,?,?,?,?,now());";
        const [results, fields] = await db.promise().execute(baseSQL, [firstName, lastName, username, email, hashedPassword]);
        if (results && results.affectedRows) {
            return results.insertId;
        } else {
            return -1;
        }
    } catch (err) {
        throw err;
    }
};

UserModel.getFirstName = async (userId) => {
    try{
        const [results, fields] = await db.promise().execute("SELECT first_name FROM Users WHERE user_id=?", [userId]);
        return results[0].first_name;
    }catch (err) {
        throw err;
    }
}

UserModel.getLastName = async (userId) => {
    try{
        const [results, fields] = await db.promise().execute("SELECT last_name FROM Users WHERE user_id=?", [userId]);
        return results[0].last_name;
    }catch (err) {
        throw err;
    }
}

UserModel.getEmail = async (userId) => {
    try{
        const [results, fields] = await db.promise().execute("SELECT user_email FROM Users WHERE user_id=?", [userId]);
        return results[0].user_email;
    }catch (err) {
        throw err;
    }
}

UserModel.getbio = async (userId) => {
    try{
        const [results, fields] = await db.promise().execute("SELECT userbio FROM Users WHERE user_id=?", [userId]);
        return results[0].userbio;
    }catch (err) {
        throw err;
    }
}

//checks that username doesn't already exist.
UserModel.usernameExists = async (username) => {
    try {
        const [results, fields] = await db.promise().execute("SELECT * FROM Users WHERE username=?", [username]);
        return !(results && results.length === 0);
    } catch (err) {
        throw err;
    }
};

//checks that email doesn't already exist.
UserModel.emailExists = async (email) => {
    try {
        const [results, fields] = await db.promise().execute("SELECT * FROM Users WHERE user_email=?", [email]);
        return !(results && results.length === 0);
    } catch (err) {
        throw err;
    }
};

//authenticates new user info.
UserModel.authenticate = async (username, password) => {
    try {
        let userId;
        const baseSQL = "SELECT user_id, username, password FROM Users WHERE username=?";
        if (username) {
            const [results, fields] = await db.promise().execute(baseSQL, [username]);
            if (results && results.length === 1) {
                userId = results[0].user_id;
                let passwordsMatch = false;
                const inputPass = await bcrypt.hash(password, 15)
                if(password && results[0].password) {
                    passwordsMatch = await bcrypt.compare(password, results[0].password);
                }
                if (passwordsMatch) {
                    return userId;
                } else {
                    return -1;
                }
            } else {
                return -1;
            }
        }
        return -1;
    } catch (err) {
        throw err;
    }
};

module.exports = UserModel;