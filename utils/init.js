import express from 'express';
import debug from 'debug';
import 'dotenv/config';
import logger from 'morgan';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Tire from '../models/tire_model.js';
debug('tire-inventory:server');
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
import multer from 'multer';

const app = express();

const sessionStore = MongoDBStore(session);

const store = new sessionStore({
  uri: process.env.MONGODB,
  databaseName: 'tire-inventory',
  collection: 'sessions',
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|gif|png)$/)) {
    return cb(null, false);
  }

  cb(undefined, true);
};

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: { maxAge: 3600000 },
  }),
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage, fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
//Set engine
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, '../public')));

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, { dbName: 'tire-inventory' });
  } catch (error) {}
};

dbConnect();

export { app, store, fileFilter, storage };
