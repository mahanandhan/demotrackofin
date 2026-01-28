import express from 'express';
import { adddata, decrementCount, getData, incrementCount } from '../controller/adddata.js';

const router = express.Router();
router.get('/', getData);
router.post('/add-data', adddata);
router.post('/increment/:id', incrementCount);
router.post('/decrement/:id', decrementCount);
export default router;