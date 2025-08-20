
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false)
  const [showHotelReg, setShowHotelReg] = useState(false)
  const [searchedCities, setSearchedCities] = useState([])
  const [rooms, setRooms] = useState([])
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms')
      if (data.success) {
        setRooms(data.rooms)
      }
      else {
        toast.error(data.message);
      }
    }
    catch (error) {
      toast.error(error.message);
    }
  }
  const fetchUser = async () => {
    console.log('Attempting to fetch user...');
    try {
      const token = await getToken();
      console.log("Token:", token ? "Present" : "Missing");

      const { data } = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        console.log("User fetched successfully:", data.user);
        setIsOwner(data.user.role === "hotelOwner");
        setSearchedCities(Array.isArray(data.user.recentSearchedCities) ? data.user.recentSearchedCities : []);
      } else {
        console.log("User not found in database, attempting manual creation...");
        const createResponse = await axios.post('/api/user/create-if-missing', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (createResponse.data.success) {
          console.log("User created successfully, retrying fetch...");
          setTimeout(fetchUser, 1000);
        } else {
          console.log("Failed to create user, retrying in 3 seconds...");
          setTimeout(fetchUser, 3000);
        }
      }
    } catch (error) {
      console.error("fetchUser error:", error);
      if (error.response?.status === 404) {
        console.log("User not found, trying to create manually...");
        try {
          const token = await getToken();
          const createResponse = await axios.post('/api/user/create-if-missing', {}, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (createResponse.data.success) {
            console.log("User created successfully, retrying fetch...");
            setTimeout(fetchUser, 1000);
          }
        } catch (createError) {
          console.error("Error creating user:", createError);
          setTimeout(fetchUser, 5000);
        }
      } else {
        console.log("Other error, retrying fetchUser in 3 seconds...");
        setTimeout(fetchUser, 3000);
      }
    }
  }; useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    fetchRooms()
  }, [])


  const value = {
    currency, navigate, user, getToken, isOwner, setIsOwner, axios, showHotelReg, setShowHotelReg, searchedCities, setSearchedCities, rooms, setRooms
  }
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
export const useAppContext = () => useContext(AppContext);
