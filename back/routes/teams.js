/**
 * Created by ilya on 02.03.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.get('/', (req, res) => {
    db.listTeams().then(data => res.send(data));
});

router.get('/:id', (req, res) => {
    db.getTeam(req)
        .then(function(result){
            res.status(200).send(result);
        })
        .catch(function(err){
            res.status(err.status).send(err)
        })
});

router.post('/', (req, res) => {
    db.createTeam(req.body).then(data => res.send(data));
});

router.delete('/:id', (req, res) => {
    db.deleteTeam(req.params.id).then(data => res.send(data));
});

router.put('/:id', (req, res) => {
    db.changeTeam(req)
        .then(function(result){
            res.status(200).send(result);
        })
        .catch(function(err){
            res.status(err.status).send(err)
        })
});


export default router