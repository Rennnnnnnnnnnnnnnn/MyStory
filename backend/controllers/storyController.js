import db from '../config/db.js';
import { encrypt, decrypt } from '../config/crypto.js';

//UPLOAD STORY
export const createStory = async (req, res) => {

    const { heading } = req.body.story || "";
    const { content } = req.body.story;
    const { audience } = req.body.story;

    const userID = req.body.user.user_id;
    const createDate = new Date();

    if (!content) {
        return res.status(404).json({ message: "Story's content cannot be empty." })
    }

    try {
        const encryptedContent = encrypt(content);

        await db.query(`INSERT INTO posts (heading, user_id, content, audience, create_date) VALUES (?, ?, ?, ?, ?)`, [heading, userID, encryptedContent, audience, createDate])
        return res.status(201).json({ message: "Story uploaded successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

// UPDATE STORY
export const updateStory = async (req, res) => {

    const { post_id } = req.params;
    const { heading } = req.body;
    const { content } = req.body;
    const { audience } = req.body;

    const body = req.body;

    console.log("qweqweqewq " , body)

    if (!content) {
        return res.status(404).json({ message: "Story's content cannot be empty." })
    }

    try {
        const encryptedContent = encrypt(content);
        await db.query(`UPDATE posts SET heading = ?, content = ?, audience = ? WHERE post_id = ?`, [heading, encryptedContent, audience, post_id])
        return res.status(200).json({ message: "Story updated successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}


// DELETE STORY
export const deleteStory = async (req, res) => {

    const { post_id } = req.params;

    try {
        const [result] = await db.query(`DELETE FROM posts WHERE post_id = ?`, [post_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Story not found." })
        }
        console.log("Story deleted successfully");
        return res.status(200).json({ message: "Story deleted successfully." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

// GET PRIVATE STORIES
export const getPrivateStories = async (req, res) => {
    const { user_id } = req.params;
    try {
        const [stories] = await db.query(`SELECT post_id, heading, content, audience, create_date FROM posts WHERE user_id = ? ORDER BY create_date DESC`, user_id)
        const decryptedStoryContent = stories.map(story => ({
            ...story,
            content: decrypt(story.content)
        }))
        console.log(decryptedStoryContent)
        return res.status(200).json(decryptedStoryContent);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

// GET PUBLIC STORIES
export const getPublicStories = async (req, res) => {

    try {
        const [stories] = await db.query(`SELECT * FROM posts WHERE audience = ? ORDER BY create_date DESC`, ["Public"])
        const decryptedStoryContent = stories.map(story => ({
            ...story,
            content: decrypt(story.content)
        }))
        return res.status(201).json(decryptedStoryContent);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}




