import express from 'express';
import {
  getSignup,
  postLogin,
  postLogout,
  postSignup,
  postLogoutAll,
  getLogin,
} from '../controllers/user_controllers.js';
import auth from '../middleware/auth.js';
import { isValid } from '../middleware/validation.js';
import joiSchemas from '../middleware/validationSchemas.js';
const userRouter = express.Router();

userRouter.route('/login').post(postLogin).get(getLogin);
// userRouter.get('/login', getLogin);

userRouter
  .route('/signup')
  .get(getSignup)
  .post(isValid(joiSchemas.user), postSignup);
// userRouter.post('/login', postLogin);
userRouter.post('/logout', auth, postLogout);
userRouter.post('/logoutAll', auth, postLogoutAll);

export default userRouter;
