const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPassword = 'testPassword';

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPassword, salt, function(err, hash) {
        console.log(hash)
    });
});