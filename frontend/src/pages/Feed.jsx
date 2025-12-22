import { useEffect, useState } from 'react';
import axiosInstance from './auth/axiosInstance.js';
import StoryCard from '../components/profile-components/StoryCard.jsx';
import Spinner from '../components/others/Spinner.jsx';
import { useAuth } from "../pages/auth/AuthProvider.jsx";
import AnnouncementToast from "../components/others/AnnouncementToast.jsx"

function Feed() {
  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(true);


  const { isAuthenticated, user } = useAuth();

  const getPublicStories = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/api/story/getPublicStories');
      setStories(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPublicStories();
  }, [])

  return (
    <>
      <div className="pt-20 bg-gray-800">
        {isLoading ?
          <div className="mt-40">
            <Spinner />
          </div>
          :
          <StoryCard stories={stories} />}
      </div>


      <AnnouncementToast />
    </>
  );
}

export default Feed;