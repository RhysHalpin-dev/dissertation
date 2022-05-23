const express = require('express');
const Activity = require('../models/activity');
const Covid = require('../models/covid')
const router = express.Router();
const getName = require('../middleware/getName')
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');
/* 

    CRUD functionality of endpoints

*/

//GET BACK ALL users TESTING
router.get('/', async (req, res) => {

    try {
        const users = await User.find();
        res.status(200).json(users);

    } catch (err) {
        res.json({ message: err });
    }
});

// return users name for welcome message
router.get('/getName', getName)


// return current number of users and building limit set
router.get('/total', async (req, res) => {

    try {
        //check total number of attendees

        const check = await User.countDocuments({ status: true })
        console.log(check);

        res.status(200).json({total: check, limit: parseInt(process.env.bLimit)});
        
    } catch (err) {
        res.json({ message: err });
    }
});
// return activity using mongoDB Activity collection
router.get('/activity', async (req, res) => {

    try {
        const statuss = await Activity.find().sort({'date': -1}).limit(20);
        res.status(200).json(statuss);

    } catch (err) {
        res.json({ message: err });
    }
});
// return covid cases using mongoDB covid collection
router.get('/covid', async (req, res) => {

    try {
        const covidFlags = await Covid.find().sort({'date': -1}).limit(20);
        res.status(200).json(covidFlags);

    } catch (err) {
        res.json({ message: err });
    }
});

//DELETE covid case from mongodb
router.delete('/covid/:postId', async (req, res) => {
    try {
        console.log(req.params.postId);
        const removedFlag = await Covid.deleteOne({ name: req.params.postId });
        const userUpdate = await User.updateOne({ name: req.params.postId }, { covidFlag: false });
        res.status(200).json(removedFlag);
    } catch (err) {
        res.status(401).json({ message: err });
    }
});

module.exports = router;