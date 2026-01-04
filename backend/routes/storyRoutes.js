import express from "express";
import { addLike, createStory, deleteLike, deleteStory, getPrivateStories, getPublicStories, updateStory, incrementReadCount } from "../controllers/storyController.js";
import authenticate from "../middlewares/authenticate.js";
import optionalAuthenticate from "../middlewares/optionalAuthenticate.js";

const router = express.Router();

// Public story routes
router.get('/getPublicStories', optionalAuthenticate, getPublicStories); // Get all public stories
// Private story routes (user-specific)
router.get('/getPrivateStories/:user_id', authenticate, getPrivateStories); // Get private stories for a specific user
// Story creation - update = delete
router.post('/createStory', authenticate, createStory); // Create a new story
router.put('/updateStory/:post_id', authenticate, updateStory); // Update an existing story
router.delete('/deleteStory/:post_id', authenticate, deleteStory); // Delete a specific story
// Like system
router.post('/addLike', authenticate, addLike); // Add a like to a story
router.delete('/deleteLike', authenticate, deleteLike); // Remove a like from a story
// Read count management (increment when a story is read)
router.post('/incrementReadCount/:post_id', optionalAuthenticate, incrementReadCount); // Increment read count of a story


export default router;

