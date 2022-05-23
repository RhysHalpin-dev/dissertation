const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    uid: Number,
    name: String,
    email: String, 
    date: { type: Date, default: Date.now },
    status: Boolean,
    covidFlag: Boolean,
});

const User = mongoose.model('User', userSchema);
module.exports = User;