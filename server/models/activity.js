const mongoose = require('mongoose');


const statusSchema = mongoose.Schema({
    name: String,
    status: Boolean,
    date: { type: Date, default: Date.now }
});

const Activity= mongoose.model('Activity', statusSchema);
module.exports = Activity;