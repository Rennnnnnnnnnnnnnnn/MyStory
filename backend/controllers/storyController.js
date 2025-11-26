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
        return res.status(201).json({ message: "Story uploaded successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}



// GET PRIVATE STORIES
export const getPrivateStories = async (req, res) => {

    const { user_id } = req.params;

    console.log("aydi ", user_id);

    try {
        const [stories] = await db.query(`SELECT post_id, heading, content, create_date FROM posts WHERE user_id = ? ORDER BY create_date DESC`, user_id)
        console.log([stories])
        return res.status(201).json( stories );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }

}

