import Joi from 'joi';
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

export const getAddSeason = async (req, res, next) => {
  res.render('create-form', {
    path: '',
    pageTitle: 'Create Season',
    label: 'Create Season',
  });
};

export const addSeason = async (req, res, next) => {
  try {
    if (req.errors) {
      const details = req.errors.details.map((detail) => {
        return { message: _.upperFirst(detail.message), path: detail.path[0] };
      });

      return res.render('create-form', {
        path: '',
        pageTitle: 'Create Season',
        errorMessage: details[0].message,
        original: req.errors._original,
        label: 'Create Season',
      });
    }

    // const exists = await Season.findOne({ name: req.body.name });

    // if (exists) {
    //   return res.send(exists.url);
    // }

    const season = new Season({ ...req.body, creator: req.session.user._id });
    await season.save();
    res.send(season);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getUpdateSeason = async (req, res, next) => {
  const season = await Season.findById(req.params.id);

  res.render('create-form', {
    path: '',
    pageTitle: 'Update Season ',

    original: season,
    label: ' Season Name',
  });
};

export const updateSeason = async (req, res, next) => {
  try {
    const season = await Season.findById({ _id: req.params.id });

    if (!season) {
      return res.status(404).send('Not found');
    } else if (season.creator.toString() !== req.session.user._id.toString()) {
      req.errors = new Joi.ValidationError('Not authorized', [
        {
          message: 'You do not have the authority to update this Season',
          path: ['name'],
          type: 'string.name',
          context: { key: 'name', label: 'name' },
        },
      ]);

      req.errors._original = season;
    }

    if (req.errors) {
      const details = req.errors.details.map((detail) => {
        return { message: _.upperFirst(detail.message), path: detail.path[0] };
      });

      return res.status(422).render('create-form', {
        path: '',
        pageTitle: 'Update Season',
        errorMessage: details[0].message,
        original: req.errors._original,
        label: 'Season Name',
      });
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
