/**
 * Created by pavluhin on 24.04.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.get('/', (req, res) => {
    db.listGames(req).then(data => res.send(data));
});

router.get('/:id', (req, res) => {
    db.getGame(req)
      .then(function(result){
          res.status(200).send(result);
      })
      .catch(function(err){
          res.status(err.status).send(err)
      })
});

router.post('/', (req, res) => {
    db.createGame(req.body).then(data => res.send(data));
});

router.delete('/:id', (req, res) => {
    db.deleteGame(req.params.id).then(data => res.send(data));
});

router.put('/:id', (req, res) => {
    db.changeGame(req)
      .then(function(result){
          res.status(200).send(result);
      })
      .catch(function(err){
          res.status(err.status).send(err)
      })
});

export default router