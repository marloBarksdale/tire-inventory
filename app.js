import helmet from 'helmet';
import _ from 'lodash';
import multer from 'multer';
import auth from './middleware/auth.js';
import Image from './models/image_model.js';
import Manufacturer from './models/manufacturer_model.js';
import Season from './models/season_model.js';
import Size from './models/size_model.js';
import Tire from './models/tire_model.js';
import User from './models/user_model.js';
import indexRouter from './routes/index.js';
import manufacturerRouter from './routes/manufacturer_routes.js';
import seasonRouter from './routes/season_routes.js';
import sizeRouter from './routes/size_routes.js';
import tireRouter from './routes/tire_routes.js';
import userRouter from './routes/user_routes.js';
import { app } from './utils/init.js';
import { createWriteStream, readFileSync } from 'fs';
import https from 'https';
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PUT,PATCH,DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

//   next();
// });
// app.use(helmet());
app.use('/tires', auth, tireRouter);
app.use('/manufacturers', auth, manufacturerRouter);
app.use('/sizes', auth, sizeRouter);
app.use('/seasons', auth, seasonRouter);
app.use(userRouter);
app.use('/', auth, indexRouter);

const populate = async () => {
  const users = await User.find();

  for (let i = 1; i < 15; i++) {
    const manufacturer = new Manufacturer({
      name: `Manufacturer ${i}`,
      creator: _.sample(users)._id,
    });

    await manufacturer.save();
  }

  for (let i = 1; i < 15; i++) {
    const season = new Season({
      name: `Season ${i}`,
      creator: _.sample(users)._id,
    });
    await season.save();
  }

  for (let i = 16; i <= 30; i++) {
    const size = new Size({
      diameter: i,
      creator: _.sample(users)._id,
    });
    await size.save();
  }

  const sizes = await Size.find();
  const manufacturers = await Manufacturer.find();
  const seasons = await Season.find();
  const images = await Image.find();

  for (let i = 1; i <= 40; i++) {
    const tire = new Tire({
      name: `Tire ${i}`,
      season: _.sample(seasons, 1)._id,
      manufacturer: _.sample(manufacturers, 1)._id,
      size: _.sample(sizes, 1)._id,
      image: _.sample(images, 1),
      creator: _.sample(users, 1)._id,
      quantity: Math.floor(Math.random() * 100),
    });
    await tire.save();
  }
};

// populate();

// const run = async () => {
//   const sizes = await Size.find();
//   const manufacturers = await Manufacturer.find();
//   const seasons = await Season.find();

//   const tire = new Tire({
//     name: 'Tire 8',
//     price: 30,
//     season: _.sample(seasons)._id,
//     manufacturer: _.sample(manufacturers)._id,
//     size: _.sample(sizes)._id,
//   });

//   await tire.save();
// };

// run();

// const run = async () => {
//   const users = await User.find();
//   const manufacturers = await Manufacturer.find();
//   const sizes = await Size.find();
//   const seasons = await Season.find();

//   for (let i = 1; i <= 20; i++) {
//     const tire = new Tire({
//       name: `Tire ${i}`,
//       season: _.sample(seasons, 1)._id,
//       manufacturer: _.sample(manufacturers, 1)._id,
//       size: _.sample(sizes, 1)._id,
//       price: Math.floor(120 + Math.random() * (200 - 120)),
//       creator: _.sample(users, 1)._id,
//       quantity: Math.floor(Math.random() * 100),
//     });
//     await tire.save();
//   }
// };

// run();

// app.use((error, req, res, next) => {
//   res.send(error);
// });

const privateKey = readFileSync('./server.key');
const certificate = readFileSync('./server.cert');

https
  .createServer({ key: privateKey, cert: certificate }, app)
  .listen(process.env.PORT, () => {
    console.log(`Up on ${process.env.PORT}`);
  });
