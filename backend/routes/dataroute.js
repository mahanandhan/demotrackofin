import express from 'express';
import { adddata, decrementCount, deleteAllData, getData, incrementCount } from '../controller/adddata.js';

const router = express.Router();
router.get('/', getData);
router.post('/add-data', adddata);
router.post('/increment/:id', incrementCount);
router.post('/decrement/:id', decrementCount);
router.delete('/delete', deleteAllData);
export default router;