import express from 'express';
import {
  getSizes,
  getSize,
  addSize,
  deleteSize,
  updateSize,
  getAddSize,
  getUpdateSize,
} from '../controllers/size_controller.js';
import { isValid } from '../middleware/validation.js';
import validationSchemas from '../middleware/validationSchemas.js';
const sizeRouter = express.Router();

sizeRouter
  .route('/add')
  .post(isValid(validationSchemas.size), addSize)
  .get(getAddSize);

sizeRouter.get(
  '/mine',
  (req, res, next) => {
    req.params.id = req.session.user._id;
    next();
  },
  getSizes,
);

sizeRouter
  .route('/:id/update')
  .post(isValid(validationSchemas.size), updateSize)
  .get(getUpdateSize);
sizeRouter.post('/:id/delete', deleteSize);

sizeRouter.get('/:id', getSize);
sizeRouter.get('/', getSizes);
export default sizeRouter;
