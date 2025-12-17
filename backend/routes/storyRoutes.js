import express from "express";
import {createStory, deleteStory, getPrivateStories, getPublicStories, updateStory} from "../controllers/storyController.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.get('/getPublicStories', getPublicStories);
router.post('/createStory', authenticate, createStory);
router.get('/getPrivateStories/:user_id', authenticate, getPrivateStories);
router.delete('/deleteStory/:post_id', authenticate, deleteStory);
router.put('/updateStory/:post_id', authenticate, updateStory);
export default router;

