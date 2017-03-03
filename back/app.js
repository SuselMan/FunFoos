/**
 * Created by pavluhin on 10.11.2016.
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import session from 'express-session';
import config from './etc/config.json';
import connectMongo from 'connect-mongo';
import * as db from './utils/DataBaseUtils';

//routes
import players from './routes/players';
import teams from './routes/teams';
import sessions from './routes/sessions';
import images from './routes/images';
import user from './routes/user';

const app = express();
let MongoStore= connectMongo(session);

db.setUpConnection(app);

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors({ origin: '*' }));
app.use(session({
    secret: 'i need more beers',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        url: `mongodb://${config.db.host}:${config.db.port}/${config.db.sessions}`
    })
}));

console.log('__dirname',__dirname);
app.use(express.static('./build'));


app.use('/api', user);
app.use('/api/players', players);
app.use('/api/teams', teams);
app.use('/api/sessions', sessions);
app.use('/api/files', images);


app.get('*', function(req, res) {
    res.sendfile('./build/index.html'); // load our public/index.html file
});



const server = app.listen(config.serverPort, function() {
    console.log(`Server is up and running on port ${config.serverPort}`);
});