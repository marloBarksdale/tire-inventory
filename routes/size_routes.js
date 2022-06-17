import express from 'express';
import {
  getSizes,
  getSize,
  addSize,
  deleteSize,
} from '../controllers/size_controller.js';
import { isValid } from '../middleware/validation.js';
import validationSchemas from '../middleware/validationSchemas.js';
const sizeRouter = express.Router();

sizeRouter.get('/', getSizes);
sizeRouter.get('/:id', getSize);
sizeRouter.post('/add-size', isValid(validationSchemas.size), addSize);
sizeRouter.post('/delete-size/:id', deleteSize);

export default sizeRouter;
