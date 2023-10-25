import express from "express";
import { getUsers, getUserById, createUser, createAdmin } from "../controller/UserController.js";
import { verifyToken } from "../controller/Auth.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.post('/admin', createAdmin);

export default router;