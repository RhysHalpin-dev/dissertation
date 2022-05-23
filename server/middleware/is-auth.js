const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        //split authorization header to grab JWT Token
        let token = req.headers.authorization.split(" ")[1];
        console.log(token)
        
        // if null reject unathorized request to api
        if (token === null) return res.sendStatus(401)

        // verify JWT is valid using the private key
        let decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;

        next();
        

    } catch (err) {
        //if token is provided but not valid respond 403 STATUS CODE
        return res.status(403).json({ auth: false, message: 'auth failed' });
    }

};