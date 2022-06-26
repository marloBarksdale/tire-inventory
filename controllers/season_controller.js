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
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const addSeason = async (req, res, next) => {
  try {
    const exists = await Season.findOne({ name: req.body.name });

    if (exists) {
      return res.send(exists);
    }

    const season = new Season({ ...req.body, creator: req.session.user._id });
    await season.save();
    res.send(season);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const updateSeason = async (req, res, next) => {
  try {
    let name = req.body.name;

    const exists = await Season.findOne({ name });

    if (exists) {
      return res.send('This season already exists: ' + exists.url);
    }

    const season = await Season.findById({ _id: req.params.id });

    if (!season) {
      return res.status(404).send('Not found');
    } else if (season.creator.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('Update not allowed');
    }

    const newSeason = await Season.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true },
    );

    res.send(newSeason);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteSeason = async (req, res, next) => {
  try {
    const season = await Season.findById(req.params.id);

    if (!season) {
      return res.send('Not found!');
    } else if (season.creator.toString() !== req.session.user._id.toString()) {
      return res.send('Deletion not allowed');
    }

    const tires = await Tire.find({ season: req.params.id });

    if (!_.isEmpty(tires)) {
      return res.send(
        'Cannot delete this Season because of existing tires: ' + tires,
      );
    }

    await Season.findByIdAndDelete(req.params.id);
    res.send(season);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
