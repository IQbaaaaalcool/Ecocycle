import express from "express";
import { jsonData } from "../controller/ArticleController.js";

const router = express.Router();

router.get('/article', (req, res) => {
    res.json(jsonData);
});

export default router;
