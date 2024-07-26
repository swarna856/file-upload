import express from "express";
import { deleteVideoAndImage } from "../controllers/delete.js";
const router = express.Router();

router.delete('/:id', deleteVideoAndImage);
export default router;
