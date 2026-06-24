import { Router } from 'express';
import * as userController from '../controllers/userController.js';

const router = Router();
console.log('userRoutes carregado!');

router.post('/cadastro', userController.cadastro);
router.post('/login', userController.login);

export default router;