import express from "express";
const router = express.Router();

import TaskController from "../controllers/TaskController.js";
import auth from "../middleware/auth.js";

router.get('/', auth, TaskController.index);
router.get('/:id', auth, TaskController.show);
router.post('/create', auth, TaskController.store);
router.patch('/:id', auth, TaskController.update);
router.delete('/:id', auth, TaskController.destroy);

 
export default router; 