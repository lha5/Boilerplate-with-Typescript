const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minLength: 8
    },
    role: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
}, { timestamps: true });

userSchema.pre('save', function (next) {
    let user = this;

    if (user.idModified('password')) {

        bcrpyt.genSalt(saltRounds, function (err, salt) {
            if (err) {return next(err);}

            bcrpyt.hash(user.password, salt, function (err, hash) {
                if (err) {return next(err);}

                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrpyt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) {return cb(err);}

        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function (cb) {
    let user = this;
    let token = jwt.sign(user._id.toHexString(), privateKey);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };