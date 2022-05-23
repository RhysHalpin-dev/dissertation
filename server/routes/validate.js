const express = require('express');
const User = require('../models/user');
const Activity = require('../models/activity');
const Covid = require('../models/covid');
const router = express.Router();

router.post('/', async (req, res) => {
    //log post payload
    console.log(req.body.uid, req.body.temp);
    const tLimit = 37.8;
    const bLimit = process.env.bLimit;
    try {

        // checks if users UID exists within DB
        const uidExists = await User.findOne({ uid: req.body.uid });
        console.log(uidExists ? 'UID exists' : 'UID does not exist');

        //check total number of attendees
        const check = await User.countDocuments({ status: true })
        console.log(check);

        // IF uid is valid and temp is "SAFE" and covid is false.  post valid: TRUE to RPI allow entry
        if ((uidExists.status === false) && (req.body.temp <= tLimit) && (uidExists.covidFlag === false) && (check < bLimit)) {

            const userUpdate = await User.updateOne({ uid: uidExists.uid }, { status: true })
            const inStatus = Activity.create({ name: uidExists.name, status: true })
            console.log('Entry accepted')
            res.status(200).json({ valid: true });
            //if user is currently in the system allow exit from mthe system
        } else if ((uidExists.status === true) && (req.body.temp <= tLimit)) {
            const userUpdate = await User.updateOne({ uid: uidExists.uid }, { status: false })
            const inStatus = Activity.create({ name: uidExists.name, status: false })
            console.log('Exit accepted')
            res.status(200).json({ valid: true });

        }// if uid exists and temp is over threshold reject entry. Post valid:false to RPI

        else if ((uidExists.status === false) && (req.body.temp > tLimit) && (check < bLimit)) {

            // add covid flag to user
            const covidUpdate = await User.updateOne({ uid: uidExists.uid }, { covidFlag: true })
            const covidStatus = Covid.create({ name: uidExists.name, email: uidExists.email, covidFlag: true, temp: req.body.temp })

            console.log('Rejected: temp over threshold')
            res.status(200).json({ valid: false });

            //user is out of system, covid flag is true. post Valid:false to RPI reject entry
        } else if ((uidExists.status === false) && (uidExists.covidFlag === true)) {
            res.status(200).json({ valid: false });
            console.log(`Rejected: covid flag true`)
            //if user is out of system and building limit is reached reject entry
        } else if ((uidExists.status === false) && (check >= bLimit)) {
            console.log('Rejected: building limit reached')
            res.status(200).json({ valid: false });

        } else {//else uid doesnt exist 
            res.status(200).json({ valid: false });
        }
    } catch (err) {
        res.status(401).json({ message: err });
    }

});
module.exports = router;