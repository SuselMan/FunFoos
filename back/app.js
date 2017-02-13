/**
 * Created by pavluhin on 10.11.2016.
 */

import express from 'express';
import mongoose from "mongoose";


const app = express();
const Schema = mongoose.Schema;
const NoteSchema = new Schema({
    title     : { type: String },
    text      : { type: String, required: true },
    color     : { type: String },
    createdAt : { type: Date }
});

const Note = mongoose.model('Note', NoteSchema);

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log('Mongo is connected');
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const server = app.listen(8080, () => {
    console.log(`Server is up and running on port 8080`);
});

