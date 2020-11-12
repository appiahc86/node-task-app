import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";

import UserController from "../controllers/UserController.js";

//My profile
router.get('/me', auth, UserController.index);

//Sign up
router.post('/register', UserController.store);

//Login
router.post('/login', UserController.login);

//Logout
router.post('/logout', auth, UserController.logout);

//Logout from all sessions
router.post('/logoutAll', auth, UserController.logoutAll);


router.get('/:id', auth, UserController.show);

//Update
router.patch('/me', auth, UserController.update);

//Delete User
router.delete('/me', auth, UserController.destroy);



export default router;