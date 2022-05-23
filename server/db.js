//db.js

require('dotenv/config');

const mongoose = require('mongoose')

const url = process.env.DB_CONNECT;

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to dB ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the dB. \n${err}`);
    })