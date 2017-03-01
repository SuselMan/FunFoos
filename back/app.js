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

app.get('/api/teams', (req, res) => {
    db.listTeams().then(data => res.send(data));
});

app.post('/api/teams', (req, res) => {
    console.log('req',req.body);
    db.createTeam(req.body).then(data => res.send(data));
});

app.delete('/api/teams/:id', (req, res) => {
    db.deleteTeam(req.params.id).then(data => res.send(data));
});


app.get('/api/players', (req, res) => {
    db.listPlayers().then(data => res.send(data));
});

app.post('/api/players', (req, res) => {
    console.log('req',req.body);
    db.createPlayer(req.body).then(data => res.send(data));
});

app.delete('/api/players/:id', (req, res) => {
    db.deletePlayer(req.params.id).then(data => res.send(data));
});


app.get('/api/seasons', (req, res) => {
    db.listSeasons().then(data => res.send(data));
});

app.post('/api/seasons', (req, res) => {
    console.log('req',req.body);
    db.createSeason(req.body).then(data => res.send(data));
});

app.delete('/api/players/:id', (req, res) => {
    db.deletePlayer(req.params.id).then(data => res.send(data));
});




app.post('/api/login', (req, res, next) => {
    if (req.session.user) {
        //return res.redirect('/');
    }
    db.checkUser(req.body)
        .then((user) => {
            if (user) {
                req.session.user = {id: user._id, name: user.name};
                res.status(200).send(user);
                //res.redirect('/signup')
            } else {
                return next(error)
            }
        })
        .catch(function (error) {
            return next(error)
        })
});

app.post('/api/signup', (req, res) => {
    console.log('req',req.body);
    db.createUser(req.body)
        .then(function(result){
            console.log("User created")
            res.status(200).send(result);
        })
        .catch(function(err){
            if (err.toJSON().code == 11000){
                res.status(500).send("This email already exist")
            }
        })
});

app.post('/api/logout', (req, res) => {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('/signup')
    }
});


app.get('*', function(req, res) {
    res.sendfile('./build/index.html'); // load our public/index.html file
});



const server = app.listen(config.serverPort, function() {
    console.log(`Server is up and running on port ${config.serverPort}`);
});