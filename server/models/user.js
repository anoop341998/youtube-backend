const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require("moment");
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        'minlength': 5,
    },
    lastname: {
        type: String,
        'maxlength': 50
    },
    image: String,
    role: {
        type: Number,
        'default': 0
    },
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    }
})

userSchema.pre('save', function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) next(err);
            
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) next(err);
                user.password = hash;
                next();
            })
        })
    }
    else{
        next();
    }
    
});
userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    let user = this;
    let token = jwt.sign(user._id.toHexString(), 'secretcharacter');
    let oneHour = moment().add(1, 'hour').valueOf();
    user.token = token;
    user.tokenExp = oneHour;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb){
    let User = this;
    jwt.verify(token, 'secretcharacter', function(err, decode){
        console.log(decode);
        User.findOne({"_id": decode, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}
const User = mongoose.model('User', userSchema);

module.exports = {User}