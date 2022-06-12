import Season from '../models/season_model.js';
import Tire from '../models/tire_model.js';

export const getSeasons = async (req, res, next) => {
  try {
    const seasons = await Season.find();
    res.send(seasons);
  } catch (error) {}
};

export const getSeason = async (req, res, next) => {
  try {
    const season = await Season.findById(req.params.id);
    const tires = await Tire.find({ season: req.params.id }).populate([
      'manufacturer',
      'size',
    ]);

    res.send({ season, tires });
  } catch (error) {}
};

export const addSeason = async (req, res, next) => {
  try {
    const season = new Season(req.body);
    await season.save();
    res.send(season);
  } catch (error) {}
};
