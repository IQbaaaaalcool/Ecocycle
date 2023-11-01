import express from "express";
import { jsonData } from "../controller/ArticleController.js";
import { Acces } from "../controller/Token.js";

const router = express.Router();

router.get('/blog', Acces,(req, res) => {
    res.json(jsonData);
});

export default router;