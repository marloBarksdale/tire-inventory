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

const app = express();

const sessionStore = MongoDBStore(session);

const store = new sessionStore({
  uri: process.env.MONGODB,
  databaseName: 'tire-inventory',
  collection: 'sessions',
});

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

//Set engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, { dbName: 'tire-inventory' });
  } catch (error) {}
};

dbConnect();

export { app };
