import express from "express";
import {createStory, getPrivateStories} from "../controllers/storyController.js";

const router = express.Router();

router.post('/createStory', createStory);
router.get('/getPrivateStories/:user_id', getPrivateStories);

export default router;

