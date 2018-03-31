/**
 * Created by ilya on 02.03.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.get('/', (req, res) => {
    db.listSeasons(req).then(data => res.send(data));
});

router.get('/:id', (req, res) => {
    db.getSeason(req)
      .then(function(result){
          res.status(200).send(result);
      })
      .catch(function(err){
          res.status(err.status).send(err)
      })
});

router.post('/', (req, res) => {
  db.checkSession(req.session.user.id)
    .then((user) => {
      return db.createSeason(req.body, user).then(data => res.send(data));
    });
});

router.put('/:id', (req, res) => {
  db.checkSession(req.session.user.id)
    .then((user) => {
      return db.changeSeason(req, user)
        .then(function (result) {
          res.status(200).send(result);
        })
        .catch(function (err) {
          res.status(err.status || 500).send(err)
        });
    });
});

export default router
