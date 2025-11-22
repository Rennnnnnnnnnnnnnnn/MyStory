import { Console } from 'console';
import db from '../config/db.js';

//UPLOAD STORY
export const createStory = async (req, res) => {

    const { heading } = req.body.story || "";
    const { content } = req.body.story;
    const userID = req.body.user.user_id;

    const createDate = new Date();

    console.log(heading, "+", content, "+", createDate)

    if (!content) {
        return res.status(404).json({ message: "Story's content cannot be empty." })
    }

    try {
        await db.query(`INSERT INTO posts (heading, user_id, content, create_date) VALUES (?, ?, ?, ?)`, [heading, userID, content, createDate])

    } catch (error) {

    }

}