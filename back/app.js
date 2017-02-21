/**
 * Created by pavluhin on 10.11.2016.
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';

import { serverPort } from './etc/config.json';

import * as db from './utils/DataBaseUtils';

const app = express();
const MongoStore = connectMongo(session);

db.setUpConnection();

app.use( bodyParser.json() );
app.use(cors({ origin: '*' }));

app.use(session({
    secret: 'monkeyslut',
    resave: false,
    saveUninitialized: false,
    // Место хранения можно выбрать из множества вариантов, это и БД и файлы и Memcached.
    store: new MongoStore({
        url: 'mongodb://user12345:foobar@localhost/test-app',
    })
}))

app.post('/login', (req, res) => {
    if (req.session.user) return res.redirect('/')
    db.checkUser(req.body)
        .then(function(user){
            if(user){
                req.session.user = {id: user._id, name: user.name}
                res.redirect('/')
            } else {
                res.send('User doesnt exist');
            }
        })
        .catch(function(error){
            return res.send(error)
        })
});

app.post('/adduser', (req, res) => {
    db.createUser(req.body)
        .then(function(result){
            console.log("User created")
        })
        .catch(function(err){
            if (err.toJSON().code == 11000){
                res.status(500).send("This email already exist")
            }
        })
});

app.post('/logout', (req, res) => {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('/')
    }
});

app.get('/teams', (req, res) => {
    db.listTeams().then(data => res.send(data));
});

app.post('/teams', (req, res) => {
    db.createTeams(req.body).then(data => res.send(data));
});

app.delete('/teams/:id', (req, res) => {
    db.deleteTeam(req.params.id).then(data => res.send(data));
});

const server = app.listen(serverPort, function() {
    console.log(`Server is up and running on port ${serverPort}`);
});