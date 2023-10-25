import express from "express";
import { Login, logOut } from "../controller/Auth.js";

const route = express.Router();

route.post('/login',Login);
route.delete('/logout',logOut);

export default route;