import express from "express";
import { getUsers, getUserById, createUser, createAdmin } from "../controller/UserController.js";
import { Acces } from "../controller/Token.js";

const router = express.Router();

router.get('/users',Acces, getUsers);
router.get('/users/:id', getUserById);
router.post('/register', createUser);
router.post('/admin', createAdmin);

export default router;