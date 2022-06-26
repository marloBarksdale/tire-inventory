import express from 'express';
import {
  getSignup,
  postLogin,
  postLogout,
  postSignup,
  postLogoutAll,
} from '../controllers/user_controllers.js';
import { isValid } from '../middleware/validation.js';
import joiSchemas from '../middleware/validationSchemas.js';
const userRouter = express.Router();

userRouter.get('/login');
userRouter.get('/signup', getSignup);
userRouter.post('/signup', isValid(joiSchemas.user), postSignup);
userRouter.post('/login', postLogin);
userRouter.post('/logout', postLogout);
userRouter.post('/logoutAll', postLogoutAll);

export default userRouter;
