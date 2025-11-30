import express from "express";
import {createStory, deleteStory, getPrivateStories, getPublicStories, updateStory} from "../controllers/storyController.js";

const router = express.Router();

router.post('/createStory', createStory);
router.get('/getPrivateStories/:user_id', getPrivateStories);
router.get('/getPublicStories', getPublicStories);
router.delete('/deleteStory/:post_id', deleteStory);
router.put('/updateStory/:post_id', updateStory);
export default router;

