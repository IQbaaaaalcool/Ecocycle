import express from "express";
import { Login, forgotPassword, resetPassword, logOut } from "../controller/Auth.js";

const route = express.Router();

route.post('/login',Login);
route.post('/forgot',forgotPassword);
route.post('/reset',resetPassword);
route.delete('/logout',logOut);

export default route;