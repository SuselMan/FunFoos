/**
 * Created by ilya on 03.03.2017.
 */
import express from 'express';
import imagesUpload from 'images-upload-middleware';

import * as db from '../utils/DataBaseUtils';

const router = express.Router();

router.post('/', imagesUpload(
    './build/files',
    'http://localhost:8080/files'
));

export default router