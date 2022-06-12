import express from 'express';
import { getSizes, getSize, addSize } from '../controllers/size_controller.js';

const sizeRouter = express.Router();

sizeRouter.get('/', getSizes);
sizeRouter.get('/:id', getSize);
sizeRouter.post('/add-size', addSize);

export default sizeRouter;
