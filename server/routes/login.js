const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {

    try {
        console.log(req.body.email, req.body.password)
        // find admin document with email
        const login = await Admin.findOne({ email: req.body.email })
        // compare password in post req with hashed password in mongoDB atlas cloud
        const match = await bcrypt.compare(req.body.password, login.password)

        // if above is true allow login
        if ((login) && (match)) {
            //generate auth token using private key
            const token = jwt.sign(
              {
                email: login.email,
                name: login.name,
                id: login._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h",
              }
            );
            return res.status(200).json({ auth: true, token: token });
        }
        else {
            err
        }
    } catch (err) {
        return res.status(401).json({ auth: false, mess: "Auth failed" })
    }



});
module.exports = router;