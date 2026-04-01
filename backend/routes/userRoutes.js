import express from 'express'
import {login, register } from '../controllers/userController.js';
import _default from 'validator';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);

//  ADD THIS From frontend-test
userRouter.get('/profile', authMiddleware, (req, res) => {
  res.json({
    success: true,
    name: req.user.name,
    email: req.user.email
  });
});


export default userRouter;