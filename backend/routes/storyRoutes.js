import express from "express";
import { addLike, createStory, deleteLike, deleteStory, getPrivateStories, getPublicStories, updateStory } from "../controllers/storyController.js";
import authenticate from "../middlewares/authenticate.js";
import optionalAuthenticate from "../middlewares/optionalAuthenticate.js";

const router = express.Router();

router.get('/getPublicStories', optionalAuthenticate, getPublicStories);
router.post('/createStory', authenticate, createStory);
router.get('/getPrivateStories/:user_id', authenticate, getPrivateStories);
router.delete('/deleteStory/:post_id', authenticate, deleteStory);
router.put('/updateStory/:post_id', authenticate, updateStory);
router.post('/addLike', authenticate, addLike);
router.delete('/deleteLike', authenticate, deleteLike);

export default router;

