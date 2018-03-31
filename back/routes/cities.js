/**
 * Created by ilya on 07.10.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.get('/', (req, res) => {
    db.listCities(req).then(data => res.send(data));
});

router.get('/:id', (req, res) => {
    db.getCity(req)
        .then(function(result){
            res.status(200).send(result);
        })
        .catch(function(err){
            res.status(err.status).send(err)
        })
});

router.post('/', (req, res) => {
  db.checkSession(req.session.user.id)
    .then(function (user) {
      return  db.createCity(req.body, user).then(data => res.send(data));
    })

});

router.put('/:id', (req, res) => {
    db.changeCity(req)
        .then(function(result){
            res.status(200).send(result);
        })
        .catch(function(err){
            res.status(err.status).send(err)
        })
});


export default router
