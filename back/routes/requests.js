/**
 * Created by ilya on 02.03.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.get('/', (req, res) => {
  db.listRequests(req).then(data => res.send(data));
});

router.get('/:id', (req, res) => {
  db.getRequest(req)
    .then(function (result) {
      res.status(200).send(result);
    })
    .catch(function (err) {
      res.status(err.status).send(err)
    })
});

router.post('/', (req, res) => {
  db.createRequest(req.body)
    .then(data => res.send(data))
    .catch((err) => {
      res.status(500).send(err)
    });
});

// router.delete('/:id', (req, res) => {
//   db.deleteRequest(req.params.id).then(data => res.send(data));
// });

router.put('/:id', (req, res) => {
  db.changeRequest(req)
    .then(function (result) {
      res.status(200).send(result);
    })
    .catch(function (err) {
      res.status(err.status).send(err)
    })
});


export default router
