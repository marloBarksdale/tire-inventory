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
import { optionalUpdate } from '../middleware/update-middleware.js';
import { isValid } from '../middleware/validation.js';
import validationSchema from '../middleware/validationSchemas.js';
import { upload } from '../utils/init.js';
const tireRouter = express.Router();

tireRouter
  .route('/add')
  .post(
    isValid(validationSchema.tire),

    addTire,
  )
  .get(getAddTire);
tireRouter.post('/:id/delete', deleteTire);
tireRouter.get(
  '/mine',
  (req, res, next) => {
    req.params.id = req.session.user._id;
    next();
  },
  getTires,
);
tireRouter
  .route('/:id/update')
  .post(optionalUpdate, isValid(validationSchema.tire), updateTire)
  .get(getUpdateTire);
tireRouter.get('/:id', getTire);
tireRouter.get('/', getTires);

export default tireRouter;
