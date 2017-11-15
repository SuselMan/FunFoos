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
import methodOverride from 'method-override';
import * as db from './utils/DataBaseUtils';

//routes
import players from './routes/players';
import places from './routes/places';
import teams from './routes/teams';
import seasons from './routes/seasons';
import subseasons from './routes/subseasons';
import images from './routes/images';
import user from './routes/user';
import meetings from './routes/meetings';
import games from './routes/games';
import cities from './routes/cities';
import divisions from './routes/divisions';
import fileUpload from 'express-fileupload';

const app = express();
let MongoStore= connectMongo(session);

db.setUpConnection(app);

// app.use(express.favicon());
//app.use(favicon(__dirname + './build/files/favicon.ico'));
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());

//TODO: make sure this is safe!
app.use(cors({ origin: '*' }));
app.use(session({
    secret: 'i need more beers',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        url: `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`
    })
}));

//app.use(fileUpload());

app.use(express.static('./build'));

app.use('/api', user);
app.use('/api/players', players);
app.use('/api/places', places);
app.use('/api/teams', teams);
app.use('/api/seasons', seasons);
app.use('/api/files', images);
app.use('/api/meetings', meetings);
app.use('/api/games', games);
app.use('/api/cities', cities);
app.use('/api/subseasons', subseasons);
app.use('/api/divisions', divisions);


app.get('/favicon.ico', function(req, res) {
    //TODO: use sendFile instead of sendfile
    res.sendfile('./back/favicon.ico'); // load our public/index.html file
});

app.get('*', function(req, res) {
    //TODO: use sendFile instead of sendfile
    res.sendfile('./build/index.html'); // load our public/index.html file
});



const server = app.listen(config.serverPort, function() {
    console.info(`Server is up and running on port ${config.serverPort}`);
});