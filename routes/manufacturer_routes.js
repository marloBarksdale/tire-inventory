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
  .route('/add-manufacturer')
  .post(isValid(joiSchemas.manufacturer), addManufacturer)
  .get(getAddManufacturer);

manufacturerRouter
  .route('/update-manufacturer/:id')
  .post(isValid(joiSchemas.manufacturer), updateManufacturer)
  .get(getUpdateManufacturer);
manufacturerRouter.post('/delete-manufacturer/:id', deleteManufacturer);
manufacturerRouter.get('/:id', getManufacturer);
manufacturerRouter.get('/', getManufacturers);

export default manufacturerRouter;
