/**
 * Created by ilya on 02.03.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.get('/', (req, res) => {
    db.listPlaces(req).then(data => res.send(data));
});

router.post('/', (req, res) => {
  db.checkSession(req.session.user.id)
    .then((user) => {
      return db.createPlace(req.body, user).then(data => res.send(data));
    });
});

router.delete('/:id', (req, res) => {
    db.deletePlace(req.params.id).then(data => res.send(data));
});

router.put('/:id', (req, res) => {
  db.checkSession(req.session.user.id)
    .then((user) => {
      return db.changePlace(req, user)
        .then(function (result) {
          res.status(200).send(result);
        })
        .catch(function (err) {
          res.status(err.status).send(err)
        });
    })
});

export default router
