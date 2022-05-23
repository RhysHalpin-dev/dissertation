const mongoose = require('mongoose');


const covidSchema = mongoose.Schema({
    name: String,
    email: String,
    covidFlag: Boolean,
    temp: Number,
    date: { type: Date, default: Date.now }
});

const Covid = mongoose.model('Covid', covidSchema);
module.exports = Covid;