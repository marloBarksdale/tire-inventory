import express from 'express';
import {
  getManufacturer,
  getManufacturers,
  addManufacturer,
  deleteManufacturer,
  updateManufacturer,
} from '../controllers/manufacturer_controller.js';
import { isValid } from '../middleware/validation.js';
import joiSchemas from '../middleware/validationSchemas.js';

const manufacturerRouter = express.Router();

manufacturerRouter.get('/', getManufacturers);
manufacturerRouter.get('/:id', getManufacturer);
manufacturerRouter.post(
  '/add-manufacturer',
  isValid(joiSchemas.manufacturer),
  addManufacturer,
);
manufacturerRouter.post(
  '/update-manufacturer/:id',
  isValid(joiSchemas.manufacturer),
  updateManufacturer,
);
manufacturerRouter.post('/delete-manufacturer/:id', deleteManufacturer);

export default manufacturerRouter;
