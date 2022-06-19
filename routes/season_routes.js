import express from 'express';
import {
  getSeasons,
  getSeason,
  addSeason,
  deleteSeason,
  updateSeason,
} from '../controllers/season_controller.js';
import { isValid } from '../middleware/validation.js';
import joiSchemas from '../middleware/validationSchemas.js';

const seasonRouter = express.Router();

seasonRouter.get('/', getSeasons);
seasonRouter.get('/:id', getSeason);
seasonRouter.post('/add-season', isValid(joiSchemas.season), addSeason);
seasonRouter.post('/delete-season/:id', deleteSeason);
seasonRouter.post('/update-season/:id', updateSeason);

export default seasonRouter;
