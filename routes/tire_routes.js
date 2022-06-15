import express from 'express';
import {
  getTires,
  getTire,
  addTire,
  deleteTire,
  updateTire,
} from '../controllers/tire_controller.js';

const tireRouter = express.Router();

tireRouter.get('/', getTires);
tireRouter.get('/:id', getTire);
tireRouter.post('/add-tire', addTire);
tireRouter.post('/delete-tire/:id', deleteTire);
tireRouter.post('/update-tire/:id', updateTire);
export default tireRouter;
