import express from 'express';
import { index } from '../controllers/tire_controller.js';

const indexRouter = express.Router();

indexRouter.get('/', index);

export default indexRouter;
