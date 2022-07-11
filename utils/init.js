import S3 from 'aws-sdk/clients/s3.js';
import MongoDBStore from 'connect-mongodb-session';
import debug from 'debug';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import logger from 'morgan';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
debug('tire-inventory:server');
const app = express();

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWSID,
    secretAccessKey: process.env.AWSSECRET,
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|gif|png)$/)) {
    return cb(null, false);
  }

  cb(undefined, true);
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: process.env.BUCKET,
    key: function (req, file, cb) {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    },
  }),
});

// s3.upload(
//   { Bucket: process.env.BUCKET, Key: 'hello', Body: file },
//   function (err, data) {
//     if (err) {
//       throw err;
//     }

//     console.log('Uploaded');
//   },
// );

const sessionStore = MongoDBStore(session);

const store = new sessionStore({
  uri: process.env.MONGODB,
  databaseName: 'tire-inventory',
  collection: 'sessions',
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   },
// });

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
// app.use(express.static(path.join(__dirname, '../images')));
// app.use(upload.single('image'));

//Set engine
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, '../public')));
app.use(upload.single('image'));

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, { dbName: 'tire-inventory' });
  } catch (error) {}
};

dbConnect();

export { app, store, upload, s3 };
