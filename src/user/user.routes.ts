import express from 'express';
import { login, signUp } from './user.controller';
import { userValidator } from './user.validator';
import { validation } from '../middleware/validate.middleware';

const router = express.Router();

router.post('/auth/signup', userValidator, validation, signUp);
router.post('/auth/login', login);

export default router;
