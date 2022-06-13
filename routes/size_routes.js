import express from 'express';
import {
  getSizes,
  getSize,
  addSize,
  deleteSize,
} from '../controllers/size_controller.js';

const sizeRouter = express.Router();

sizeRouter.get('/', getSizes);
sizeRouter.get('/:id', getSize);
sizeRouter.post('/add-size', addSize);
sizeRouter.post('/delete-size/:id', deleteSize);

export default sizeRouter;
