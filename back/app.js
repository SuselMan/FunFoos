/**
 * Created by pavluhin on 10.11.2016.
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { serverPort } from './etc/config.json';

import * as db from './utils/DataBaseUtils';

const app = express();

db.setUpConnection(app);

app.use( bodyParser.json() );
app.use(cors({ origin: '*' }));

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