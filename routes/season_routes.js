import express from 'express';
import {
  getSeasons,
  getSeason,
  addSeason,
  deleteSeason,
  updateSeason,
  getAddSeason,
  getUpdateSeason,
} from '../controllers/season_controller.js';
import { isValid } from '../middleware/validation.js';
import joiSchemas from '../middleware/validationSchemas.js';

const seasonRouter = express.Router();

seasonRouter
  .route('/add-season')
  .post(isValid(joiSchemas.season), addSeason)
  .get(getAddSeason);
seasonRouter.post('/:id/delete', deleteSeason);

seasonRouter.get(
  '/mine',
  (req, res, next) => {
    req.params.id = req.session.user._id;
    next();
  },
  getSeasons,
);

seasonRouter
  .route('/:id/update')
  .post(isValid(joiSchemas.season), updateSeason)
  .get(getUpdateSeason);
seasonRouter.get('/:id', getSeason);
seasonRouter.get('/', getSeasons);

export default seasonRouter;
