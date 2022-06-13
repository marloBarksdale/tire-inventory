import express from 'express';
import {
  getSeasons,
  getSeason,
  addSeason,
  deleteSeason,
} from '../controllers/season_controller.js';

const seasonRouter = express.Router();

seasonRouter.get('/', getSeasons);
seasonRouter.get('/:id', getSeason);
seasonRouter.post('/add-season', addSeason);
seasonRouter.post('/delete-season/:id', deleteSeason);

export default seasonRouter;
