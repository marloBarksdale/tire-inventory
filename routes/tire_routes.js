import express from 'express';
import validator from 'validator';
import {
  getTires,
  getTire,
  addTire,
  deleteTire,
  updateTire,
} from '../controllers/tire_controller.js';
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
tireRouter.post('/update-tire/:id', updateTire);
export default tireRouter;
