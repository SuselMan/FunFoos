/**
 * Created by ilya on 03.03.2017.
 */
import express from 'express';
import imagesUpload from 'images-upload-middleware';

import * as db from '../utils/DataBaseUtils';

const router = express.Router();

//TODO: check that returns available  path
router.post('/', imagesUpload(
    './build/files',
    '/files'
));

export default router