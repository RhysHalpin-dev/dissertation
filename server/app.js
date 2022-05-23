const { Console } = require('console');
const db = require('./db.js');
const express = require('express');
const Covid = require('./models/covid');
const Activity = require('./models/activity');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
//HTTPS with SSL server listener 
const PORT = process.env.PORT;

/*//HTTPS certificate configuration for SSL API
const sslServer = require('https').createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app)*/
const server = http.createServer(app);

/*SOCKET IO INIT && UPDATE STREAMS */

// sets CORS Policy for websocket
/*const io = require('socket.io')(sslServer, {
    cors: {
        origin: '*',
    }
});*/

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

/*mongoDB changestream wtaching for changes to relevant DB collection */
const activityStream = Activity.watch([
    { $match: { "operationType": "insert" } }
]);
const changeStream = Covid.watch([
    { $match: { "operationType": "insert" } }
]);
const deleteStream = Covid.watch([
    { $match: { "operationType": "delete" } }
]);
/* On change listeners emit message from server to client if mongoDB collection changes detected */
activityStream.on('change', (change) => {
    io.emit('activityData', change);
    io.emit('totalData',change )
});
deleteStream.on('change', (change) => {
    io.emit('deleteData', change);
});
changeStream.on('change', (change) => {
    console.log(change.fullDocument); 
    io.emit('changeData', change);
});

//logs to console when a client connects
io.on('connection', socket => {
    console.log('A user connected');

    //logs to console when a client disconnects
    socket.on('disconnect', function () {
        socket.removeAllListeners();
        console.log('A user disconnected');
    });
});

require('dotenv/config');

const bodyParser = require('body-parser');

const isAuth = require('./middleware/is-auth');

// parse JSON Body
app.use(express.json());

/*
 *  TODO:
 *  Add CORS POLICY for ANY domain connections
 *  Add specific CORS connection for specific domains only -
 *  once deployed
 */

app.use(cors({origin: '*'}));

//import routes
const crudRoute = require('./routes/crud');
const validRoute = require('./routes/validate');
const loginRoute = require('./routes/login');

/* ROUTES */
// Protected Route - isAuth Middleware - checks valid JWT token is supplied by the client before continuing to endpoint
app.use('/crud', isAuth, crudRoute);
// unprotected routes
app.use('/validate', validRoute);
app.use('/login', loginRoute);

//MAIN API ROUTE ACCESS POINT
app.get('/', (req, res) => {
    res.status(200).json({ message: 'welcome to covid app endpoints Rhys Halpin / w15020067' });
});

//Route to check client JWT is valid
app.get('/isAuth', isAuth, (req, res) => {
    
});

/* Route to json error page  if route isn't valid
*
* '*' any route other than valid
*
*/
app.get('*', (req, res) => {
    res.status(404).json({ message: 404 });
});

/*
 * SSL server listening on port 3443 PORT const .env file
 */
/*sslServer.listen(PORT, () => console.log(`listening on secure port ${PORT}`));*/

server.listen(PORT, () => console.log(`listening on secure port ${PORT}`));
