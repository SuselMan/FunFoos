/**
 * Created by pavluhin on 24.04.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.get('/', (req, res) => {
  db.listMeetings(req).then(data => res.send(data));
});

router.get('/:id', (req, res) => {
  db.getMeeting(req)
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
        return db.createMeeting(req.body, user).then(data => res.send(data));
    })
});

router.delete('/:id', (req, res) => {
  db.checkSession(req.session.user.id)
    .then((user) => {
        return db.deleteMeeting(req.params.id, user).then(data => res.send(data));
    });
});

router.put('/:id', (req, res) => {
  db.checkSession(req.session.user.id)
    .then((user) => {
      return db.changeMeeting(req, user)
        .then(function (result) {
          res.status(200).send(result);
        })
        .catch(function (err) {
          res.status(err.status).send(err)
        })
    });
});

export default router
