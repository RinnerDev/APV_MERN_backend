//------ routes > veterinarioRoutes.js -----//

import express from "express";
import {registrar, perfil, confirmar, autenticar, resetPassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword} from "../controllers/veterinarioController.js";
import checkAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', registrar);
router.get('/confirmar-cuenta/:token', confirmar);
router.post('/login', autenticar);
router.post('/password-reset', resetPassword);
router.route('/password-reset/:token').get(comprobarToken).post(nuevoPassword)

router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/cambiar-password', checkAuth, actualizarPassword);

export default router;