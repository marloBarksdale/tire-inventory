import express from 'express';
import {
  getManufacturer,
  getManufacturers,
  addManufacturer,
} from '../controllers/manufacturer_controller.js';

const manufacturerRouter = express.Router();

manufacturerRouter.get('/', getManufacturers);
manufacturerRouter.get('/:id', getManufacturer);
manufacturerRouter.post('/add-manufacturer', addManufacturer);

export default manufacturerRouter;
