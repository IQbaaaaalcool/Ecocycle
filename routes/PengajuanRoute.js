import express from "express";
import { getRiwayatSendiri, getRiwayatSampah, createAlamat, createPengajuan, approvePengajuan } from "../controller/PengajuanController.js";
import { Acces } from "../controller/Token.js";

const router = express.Router();

router.get('/pengajuan', getRiwayatSampah);
router.get('/pengajuans', getRiwayatSendiri);
router.post('/pengajuan', createPengajuan);
router.post('/pengajuann',Acces, createAlamat);
router.post('/pengajuann/:pengajuanId', approvePengajuan);

export default router;