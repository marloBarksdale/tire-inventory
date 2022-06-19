import _ from 'lodash';
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
    // const tires = await Tire.find({ season: req.params.id }).populate([
    //   'manufacturer',
    //   'size',
    // ]);

    res.send(season);
  } catch (error) {}
};

export const addSeason = async (req, res, next) => {
  try {
    const exists = await Season.findOne({ name: req.body.name });

    if (exists) {
      return res.send(exists.url);
    }

    const season = new Season(req.body);
    await season.save();
    res.send(season);
  } catch (error) {}
};

export const updateSeason = async (req, res, next) => {
  try {
    let name = req.body.name;

    const exists = await Season.findOne({ name });

    if (exists) {
      return res.send('This season already exists: ' + exists.url);
    }

    const season = await Season.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true },
    );
  } catch (error) {}
};

export const deleteSeason = async (req, res, next) => {
  try {
    const tires = await Tire.find({ season: req.params.id });

    if (!_.isEmpty(tires)) {
      return res.send(
        'Cannot delete this Season because of existing tires: ' + tires,
      );
    }

    const season = await Season.findByIdAndDelete(req.params.id);
    res.send(season);
  } catch (error) {}
};
