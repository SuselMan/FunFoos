/**
 * Created by ilya on 10.10.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.get('/', (req, res) => {
    db.listDivisions(req).then(data => res.send(data));
});

router.post('/', (req, res) => {
    db.checkSession(req.session.user.id)
        .then(function (user) {
            return db.createDivision(req.body,user)
        })
        .then(data => res.send(data))
        .catch(function (err) {
            res.status(err.status).send(err);
        })
});

router.delete('/:id', (req, res) => {
    db.deletePlayer(req.params.id).then(data => res.send(data));
});

router.put('/:id', (req, res) => {
    db.changeDivision(req)
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(err.status).send(err)
        })
});

export default router