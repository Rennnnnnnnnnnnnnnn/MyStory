import { useEffect, useState } from 'react';
import axiosInstance from './auth/axiosInstance.js';
import StoryCard from '../components/profile-components/StoryCard.jsx';
import Spinner from '../components/others/Spinner.jsx';
import { useAuth } from "../pages/auth/AuthProvider.jsx";
import AnnouncementToast from "../components/others/AnnouncementToast.jsx"
import { useLocation } from "react-router-dom";



function Feed() {
  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  
  const getPublicStories = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/api/story/getPublicStories');
      setStories(res.data);
      console.log(res.data, "aaaaa")
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPublicStories();
  }, [])



  // ✅ EARLY RETURN FOR LOADING
  if (isLoading) {
    return (
      <div className="mt-40 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="pt-20 bg-gray-800 min-h-screen">
        <StoryCard stories={stories} />
      </div>

      {/* <AnnouncementToast /> */}
    </>
  );
}

export default Feed;
