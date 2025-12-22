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
        const [stories] = await db.query(`SELECT 
    p.post_id, 
    p.heading, 
    p.content, 
    p.audience, 
    p.create_date, 
    COUNT(l.post_id) AS total_likes
FROM 
    posts p
LEFT JOIN 
    likes l ON p.post_id = l.post_id
WHERE 
    p.user_id = ?
GROUP BY 
    p.post_id
ORDER BY 
    p.create_date DESC
`, user_id)
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

    const user_id = req.userData?.user_id || null;

    try {

        let stories;
        if (user_id) {
            // User is logged in → check likes
            [stories] = await db.query(`
        SELECT 
            p.*, 
            CASE WHEN l.user_id IS NOT NULL THEN 1 ELSE 0 END AS isLiked
        FROM posts p
        LEFT JOIN likes l 
            ON p.post_id = l.post_id AND l.user_id = ?
        WHERE p.audience = ?
        ORDER BY p.create_date DESC
        `, [user_id, "Public"]);
        } else {
            // No user → don't join likes
            [stories] = await db.query(`
        SELECT 
            p.*,
            0 AS isLiked
        FROM posts p
        WHERE p.audience = ?
        ORDER BY p.create_date DESC
        `, ["Public"]);
        }
        const decryptedStoryContent = stories.map(story => ({
            ...story,
            content: decrypt(story.content),
            isLiked: story.isLiked === 1
        }));

        return res.status(200).json(decryptedStoryContent);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


// ADD LIKE
export const addLike = async (req, res) => {

    const { post_id, user_id } = req.body;

    try {
        await db.query(`INSERT INTO likes (user_id, post_id) VALUES (?, ?)`, [user_id, post_id])
        console.log("nag add like")
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });

    }
}


export const deleteLike = async (req, res) => {
    const { user_id, post_id } = req.query;
    try {
        await db.query(`DELETE FROM likes WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
        console.log("nagdelete like")
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}



