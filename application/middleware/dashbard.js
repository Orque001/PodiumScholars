const { usernameExists } = require('../models/users.js');
const {getUserInfo, getUserBio} = require('./models/dashboard.js');
const dashMiddleware = {};

dashMiddleware.getCurrUser = async function(req, res, next){
    try{
        let results = await getCurrentUser(username);
        if(results && results.length){
            res.locals.currentUser = results[0]
            next();
        }else{
            req.flash('error', 'Sorry, we could not find you');
            res.redirect('/');
        }
    }catch (error){
        next(err);
    }
}


module.exports = dashMiddleware;