/**
 * Created by ilya on 03.03.2017.
 */

import express from 'express';
import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.post('/login', (req, res, next) => {
    if (req.session.user) {
        //return res.redirect('/');
    }
    db.checkUser(req.body)
        .then((user) => {
            if (user) {
                req.session.user = {id: user._id, name: user.name};
                res.status(200).send(user);
                //res.redirect('/signup')
            } else {
                return next(error)
            }
        })
        .catch(function (error) {
            return next(error)
        })
});

router.post('/signup', (req, res) => {
    console.log('req',req.body);
    db.createUser(req.body)
        .then(function(result){
            console.log("User created")
            res.status(200).send(result);
        })
        .catch(function(err){
            if (err.toJSON().code == 11000){
                res.status(500).send("This email already exist")
            }
        })
});

router.post('/logout', (req, res) => {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('/signup')
    }
});

router.put('/user/:id', (req, res) => {
    db.changeUser(req)
        .then(function(result){
            console.log("qwe",result);
            //res.status(200).send(result);
        })
        .catch(function(err){
            console.log('BAABABA',err);
            // if (err.toJSON().code == 11000){
            //     res.status(500).send("Something Wrong")
            // }
        })
});

export default router