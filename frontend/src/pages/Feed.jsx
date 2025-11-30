import { useEffect, useState } from 'react';
import axiosInstance from './auth/axiosInstance.js';
import StoryCard from '../components/profile-components/StoryCard.jsx';

function Feed() {
  const [stories, setStories] = useState([])

  useEffect(() => {
    const getPublicStories = async () => {
      try {
        const res = await axiosInstance.get('/api/story/getPublicStories');
        setStories(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    getPublicStories();
  }, []);

  return (
    <>
      <div>

        <div>
          <StoryCard stories={stories} />
        </div>
      </div>
    </>
  );
}

export default Feed;