import express from "express";
import { getUsers, getUserById, createUser, createAdmin,deleteUsers } from "../controller/UserController.js";
import { Acces } from "../controller/Token.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/register', createUser);
router.post('/admin', createAdmin);
router.delete('/delete', deleteUsers);

export default router;