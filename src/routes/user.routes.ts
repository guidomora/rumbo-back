import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const userRouter = Router();
const controller = new UserController();

userRouter.post('/', controller.createUser);
userRouter.post('/login', controller.loginUser);
userRouter.get('/:id', controller.getUserById);
userRouter.post('/:email/password', controller.updatePassword);
userRouter.post('/:id/ratings', controller.rateUser);

export default userRouter;
