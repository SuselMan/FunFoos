/**
 * Created by ilya on 02.03.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.get('/', (req, res) => {
    db.listTeams().then(data => res.send(data));
});

router.post('/', (req, res) => {
    console.log('req',req.body);
    db.createTeam(req.body).then(data => res.send(data));
});

router.delete('/:id', (req, res) => {
    db.deleteTeam(req.params.id).then(data => res.send(data));
});

export default router