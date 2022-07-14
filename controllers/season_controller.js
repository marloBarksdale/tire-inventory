import Joi from 'joi';
import _ from 'lodash';
import Season from '../models/season_model.js';
import Tire from '../models/tire_model.js';

export const getSeasons = async (req, res, next) => {
  try {
    const match = {};
    const owner = {};
    if (req.params.id) {
      match.creator = req.params.id;
      owner.creator = true;
    }

    const seasons = await Season.find(match).populate('tires');
    res.render('list', {
      pageTitle: 'All Seasons',
      items: seasons,
    });
  } catch (error) {}
};

export const getSeason = async (req, res, next) => {
  try {
    if (req.session.error) {
      res.locals.errorMessage = req.session.error;
    }
    const match = {};
    const owner = {};
    if (req.params.id) {
      match.creator = req.params.id;
    }
    const page = parseInt(req.query.page) || 1;

    const season = await Season.findById(req.params.id).populate('tires');
    const tires = await Tire.find({ season: req.params.id })
      .populate(['size', 'manufacturer', 'season', 'image'])
      .skip((page - 1) * 6)
      .limit(6);

    const count = season.tires.length;
    if (season.creator._id.toString() === req.session.user._id.toString()) {
      owner.main = true;
    }
    res.render('tire/tire_list', {
      pageTitle: 'All Tires',
      path: '/tires',
      subHeading: `/${season.name}`,
      prods: tires,
      item: season,
      owner,
      currentPage: page,
      hasNext: 6 * page < count,
      hasPrevious: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(count / 6),
    });
    next();
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
    res.redirect(season.url);
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

    res.redirect(newSeason.url);
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
      req.session.error =
        'Cannot delete this season because of the existing tires below.';

      return res.redirect(season.url);
    }

    await Season.findByIdAndDelete(req.params.id);
    res.redirect('/seasons/mine');
  } catch (error) {
    res.status(500).send(error.message);
  }
};
