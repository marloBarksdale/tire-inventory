import express from 'express';
import {
  getSeasons,
  getSeason,
  addSeason,
  deleteSeason,
  updateSeason,
  getAddSeason,
} from '../controllers/season_controller.js';
import { isValid } from '../middleware/validation.js';
import joiSchemas from '../middleware/validationSchemas.js';

const seasonRouter = express.Router();

seasonRouter
  .route('/add-season')
  .post(isValid(joiSchemas.season), addSeason)
  .get(getAddSeason);
seasonRouter.post('/delete-season/:id', deleteSeason);
seasonRouter.post(
  '/update-season/:id',
  isValid(joiSchemas.season),
  updateSeason,
);
seasonRouter.get('/:id', getSeason);
seasonRouter.get('/', getSeasons);

export default seasonRouter;
