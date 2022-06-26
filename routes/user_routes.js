import express from 'express';
import {
  getSignup,
  postLogin,
  postSignup,
} from '../controllers/user_controllers.js';
import { isValid } from '../middleware/validation.js';
import joiSchemas from '../middleware/validationSchemas.js';
const userRouter = express.Router();

userRouter.get('/login');
userRouter.get('/signup', getSignup);
userRouter.post('/signup', isValid(joiSchemas.user), postSignup);
userRouter.post('/login', postLogin);
userRouter.post('/logout');

export default userRouter;