/**
 * Created by ilya on 02.03.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.get('/', (req, res) => {
  db.listMeetings(req)
    .then((meetings) => {
      db.listTeams(req, meetings).then(data => res.send(data));
    });
});

router.get('/:id', (req, res) => {
  db.getTeam(req)
    .then(function (result) {
      res.status(200).send(result);
    })
    .catch(function (err) {
      res.status(err.status).send(err)
    })
});

router.post('/', (req, res) => {
  db.checkSession(req.session.user.id)
    .then((user) => {
      return db.createTeam(req.body, user)
        .then(data => res.send(data))
        .catch((err) => {
          res.status(500).send(err)
        });
    });
});

// router.delete('/:id', (req, res) => {
//   db.deleteTeam(req.params.id).then(data => res.send(data));
// });

router.put('/:id', (req, res) => {
  console.log('put');
  db.checkSession(req.session.user.id)
    .then((user) => {
        return db.changeTeam(req, user)
          .then(function (result) {
            res.status(200).send(result);
          })
          .catch(function (err) {
            res.status(err.status).send(err)
          });
    });
});


export default router
