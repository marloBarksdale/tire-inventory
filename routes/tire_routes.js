import express from 'express';
import {
  addTire,
  deleteTire,
  getTire,
  getTires,
  updateTire,
} from '../controllers/tire_controller.js';
import { optionalUpdate } from '../middleware/update-middleware.js';
import { isValid } from '../middleware/validation.js';
import validationSchema from '../middleware/validationSchemas.js';
const tireRouter = express.Router();

tireRouter.get('/', getTires);
tireRouter.get('/:id', getTire);
tireRouter.post(
  '/add-tire',
  isValid(validationSchema.tire),

  addTire,
);
tireRouter.post('/delete-tire/:id', deleteTire);
tireRouter.post(
  '/update-tire/:id',
  optionalUpdate(),
  isValid(validationSchema.tire),
  updateTire,
);
export default tireRouter;
