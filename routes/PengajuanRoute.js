import express from "express";
import { getRiwayatSendiri,getRiwayatSampah, createPengajuan } from "../controller/PengajuanController.js";

const router = express.Router();

router.get('/pengajuan', getRiwayatSampah);
router.get('/pengajuans', getRiwayatSampah);
router.post('/pengajuan', createPengajuan);

export default router