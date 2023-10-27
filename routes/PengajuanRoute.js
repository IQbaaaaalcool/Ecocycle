import express from "express";
import { createPengajuan } from "../controller/PengajuanController.js";
import { verifyToken } from "../controller/Auth.js";

const router = express.Router();

router.post('/pengajuan',verifyToken, createPengajuan);

export default router