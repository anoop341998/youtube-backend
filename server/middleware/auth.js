const {User} = require('../models/user');

let auth = (req, res, next) => {
    let token = req.cookies.x_auth;
    // console.log(token);
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        // console.log(err,user);
        if(!user) return res.status(200).json({
            isAuth: false,
            error: true,
        })
        req.token = token;
        req.user = user;
        req.user._id = user._id;
        next();
    })
}

module.exports = {auth};