import express from 'express';
import { getTires, getTire, addTire } from '../controllers/tire_controller.js';

const tireRouter = express.Router();

tireRouter.get('/', getTires);
tireRouter.get('/:id', getTire);
tireRouter.post('/add-tire', addTire);
export default tireRouter;
