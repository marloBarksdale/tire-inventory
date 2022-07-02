import express from 'express';
import {
  addTire,
  deleteTire,
  getAddTire,
  getTire,
  getTires,
  getUpdateTire,
  updateTire,
} from '../controllers/tire_controller.js';
import auth from '../middleware/auth.js';
import { optionalUpdate } from '../middleware/update-middleware.js';
import { isValid } from '../middleware/validation.js';
import validationSchema from '../middleware/validationSchemas.js';
const tireRouter = express.Router();

tireRouter
  .route('/add-tire')
  .post(
    isValid(validationSchema.tire),

    addTire,
  )
  .get(getAddTire);
tireRouter.post('/delete-tire/:id', deleteTire);

tireRouter
  .route('/update-tire/:id')
  .post(optionalUpdate, isValid(validationSchema.tire), updateTire)
  .get(getUpdateTire);
tireRouter.get('/:id', getTire);
tireRouter.get('/', getTires);

export default tireRouter;
