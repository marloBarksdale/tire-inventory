import express from 'express';
import {
  getManufacturer,
  getManufacturers,
  addManufacturer,
  deleteManufacturer,
  updateManufacturer,
  getAddManufacturer,
} from '../controllers/manufacturer_controller.js';
import { isValid } from '../middleware/validation.js';
import joiSchemas from '../middleware/validationSchemas.js';

const manufacturerRouter = express.Router();

manufacturerRouter
  .route('/add-manufacturer')
  .post(isValid(joiSchemas.manufacturer), addManufacturer)
  .get(getAddManufacturer);

manufacturerRouter.post(
  '/update-manufacturer/:id',
  isValid(joiSchemas.manufacturer),
  updateManufacturer,
);
manufacturerRouter.post('/delete-manufacturer/:id', deleteManufacturer);
manufacturerRouter.get('/:id', getManufacturer);
manufacturerRouter.get('/', getManufacturers);

export default manufacturerRouter;
