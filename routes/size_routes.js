import express from 'express';
import {
  getSizes,
  getSize,
  addSize,
  deleteSize,
  updateSize,
  getAddSize,
} from '../controllers/size_controller.js';
import { isValid } from '../middleware/validation.js';
import validationSchemas from '../middleware/validationSchemas.js';
const sizeRouter = express.Router();

sizeRouter
  .route('/add-size')
  .post(isValid(validationSchemas.size), addSize)
  .get(getAddSize);
sizeRouter.post(
  '/update-size/:id',
  isValid(validationSchemas.size),
  updateSize,
);
sizeRouter.post('/delete-size/:id', deleteSize);

sizeRouter.get('/:id', getSize);
sizeRouter.get('/', getSizes);
export default sizeRouter;
