import express from 'express';
import {
  getManufacturer,
  getManufacturers,
  addManufacturer,
  deleteManufacturer,
  updateManufacturer,
  getAddManufacturer,
  getUpdateManufacturer,
} from '../controllers/manufacturer_controller.js';
import { isValid } from '../middleware/validation.js';
import joiSchemas from '../middleware/validationSchemas.js';

const manufacturerRouter = express.Router();

manufacturerRouter
  .route('/add')
  .post(isValid(joiSchemas.manufacturer), addManufacturer)
  .get(getAddManufacturer);
manufacturerRouter.get(
  '/mine',
  (req, res, next) => {
    req.params.id = req.session.user._id;
    next();
  },
  getManufacturers,
);
manufacturerRouter
  .route('/:id/update')
  .post(isValid(joiSchemas.manufacturer), updateManufacturer)
  .get(getUpdateManufacturer);
manufacturerRouter.post('/:id/delete', deleteManufacturer);
manufacturerRouter.get('/:id', getManufacturer, (req, res, next) => {
  if (req.session.error) {
    delete req.session.error;
    req.session.save();
  }
  next();
});
manufacturerRouter.get('/', getManufacturers);

export default manufacturerRouter;
