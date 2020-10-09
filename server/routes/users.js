const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const {auth} = require('../middleware/auth');


router.get('/auth',auth, (req,res) => {
    return res.status(200).json({
        _id: req.user._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
     })
})


router.post('/register', (req, res) => {
    const user = new User(req.body);
    user.save()
        .then(( Userdata) => {
        return res.status(200).json({
            success: true,
            creation:'successfully created'});
    })
        .catch((err) => {
          return res.status(400).json({success:false, err})
        })
})
router.get('/', (req, res) => {
    res.send('hello');
})



router.post('/login', (req,res) => {

    //find the email
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user){
            return res.send({
                loginSuccess: false,
                error: 'user not found'
            });
        } 
    //compare the password

    user.comparePassword(req.body.password, (err, isMatch) => {
        if(!isMatch){
            return res.json({
                loginSuccess: false,
                error: 'wrong password'
            });
        }
        //generate token
        user.generateToken((err, userData) => {
            if(err) res.status(400).json({error: 'unable to generate token'});
            res.cookie("x_authExp", user.tokenExp); 
                res.cookie('x_auth',user.token)
                .status(200)
                .json({
                    loginSuccess: true, userId: user._id
                })
        })
    })

})
})


router.get('/logout', auth, (req,res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: "", tokenExp: ""}, (err, user) => {
        if(err) return res.json({
            success: false,
        })
        return res.status(200).json({
            success: true,
        })
    })
})

module.exports = router;