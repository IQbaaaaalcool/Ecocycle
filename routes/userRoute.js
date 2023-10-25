import express from "express";
import { getUsers, getUserById, createUser, createAdmin } from "../controller/UserController.js";
import { verifyToken } from "../controller/Auth.js";

const router = express.Router();

router.get('/users',verifyToken, getUsers);
router.get('/users/:id',verifyToken, getUserById);
router.post('/users',verifyToken, createUser);
router.post('/admin',verifyToken, createAdmin);

export default router;