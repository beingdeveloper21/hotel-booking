import React, { useMemo } from 'react';
import Title from './Title';
import HotelCard from './HotelCard';
import { useAppContext } from '../context/AppContext';

const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext();

  // ✅ Filter rooms dynamically, no local state needed
  const recommended = useMemo(() => {
    if (!rooms || rooms.length === 0) return [];
    return rooms.filter(
      (room) =>
        room.hotel && 
        room.hotel.city &&
        searchedCities.includes(room.hotel.city)
    );
  }, [rooms, searchedCities]);

  if (recommended.length === 0) return null;

  return (
    <div className="flex flex-col items-center px-16 md:px-26 lg:px-24 bg-slate-50 py-20">
      <Title
        title="Recommended Hotels"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />
      <div className="flex flex-nowrap overflow-x-auto gap-8 w-full mt-20 no-scrollbar">
        {recommended.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedHotels;
