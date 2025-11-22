import express from "express";
import {createStory} from "../controllers/storyController.js";

const router = express.Router();

router.post('/createStory', createStory);

export default router;

