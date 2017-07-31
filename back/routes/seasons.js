/**
 * Created by ilya on 02.03.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.get('/', (req, res) => {
    db.listSeasons(req).then(data => res.send(data));
});

router.post('/', (req, res) => {
    db.createSeason(req.body).then(data => res.send(data));
});

router.put('/:id', (req, res) => {
    db.changeSeason(req)
        .then(function(result){
            res.status(200).send(result);
        })
        .catch(function(err){
            res.status(err.status).send(err)
        })
});

router.delete('/:id', (req, res) => {
    db.deletePlayer(req.params.id).then(data => res.send(data));
});
export default router