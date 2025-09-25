import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  // ✅ Fetch all rooms from backend
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Fetch user info
  // const fetchUser = async () => {
  //   try {
  //     const token = await getToken();
  //     const { data } = await axios.get("/api/user", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (data.success) {
  //       setIsOwner(data.role === "hotelOwner");
  //       setSearchedCities(
  //         Array.isArray(data.recentSearchedCities)
  //           ? data.recentSearchedCities
  //           : []
  //       );
  //     } else {
  //       // Retry after 5s if user not fetched
  //       setTimeout(fetchUser, 5000);
  //     }
  //   } catch (error) {
  //     console.error("fetchUser error:", error);
  //     setTimeout(fetchUser, 5000);
  //   }
  // };
  const fetchUser = async () => {
  try {
    const token = await getToken();
    const { data } = await axios.get("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.success) {
      setIsOwner(data.user.role === "hotelOwner"); // ✅ check role from backend
      setSearchedCities(Array.isArray(data.user.recentSearchedCities) ? data.user.recentSearchedCities : []);
    }
  } catch (error) {
    console.error("fetchUser error:", error);
  }
};


  // Fetch user once user is loaded
  useEffect(() => {
    if (user) fetchUser();
  }, [user]);

  // Fetch rooms on app load
  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
    fetchRooms, // ✅ Exposed for components like AddRoom
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
