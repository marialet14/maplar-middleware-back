import { Router } from 'express';
import * as imovelController from '../controllers/imovelController.js';
import * as userController from '../controllers/userController.js';
import userRoutes from './userRoutes.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const routes = Router();
console.log('routes carregado!');


routes.use('/usuarios', userRoutes);

routes.post('/imoveis', verificarToken, imovelController.criar);
routes.get('/imoveis', verificarToken, imovelController.listar);
routes.get('/imoveis/:id', verificarToken, imovelController.buscarPorId);
routes.put('/imoveis/:id', verificarToken, imovelController.atualizar);
routes.delete('/imoveis/:id', verificarToken, imovelController.deletar);
routes.get('/usuarios', userController.listarUsuarios);

export default routes;