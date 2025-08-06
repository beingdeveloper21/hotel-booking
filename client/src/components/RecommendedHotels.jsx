import React from 'react'
import Title from './Title'
import HotelCard from './HotelCard'
import {useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useState,useEffect } from 'react'
const RecommendedHotels = () => {
  const {rooms,searchedCities}=useAppContext();
  const [recommended,setRecommended]=useState([]);
  const filterHotels=()=>{
    const filteredHotels=rooms.slice().filter(room=>searchedCities.includes(room.hotel.city));
    setRecommended(filteredHotels);
  }
  useEffect(()=>{
    filterHotels()
  },[rooms,searchedCities])
  return  recommended.length>0 && (
  
    <div className='flex flex-col items-center px-16 md:px-26 lg:px-24 bg-slate-50 py-20'>
      <Title title='Recommended Hotels' subTitle='Discover our handpicked selection of exceptional properties around the world,offering unparalleled luxury and unforgettable experiences.'/>
       <div className='flex flex-nowrap overflow-x-auto   gap-8 w-full mt-20 no-scrollbar'>
        {recommended.slice(0,4).map((room,index)=>(
            <HotelCard key={room._id} room={room} index={index}/>
        ))}
      </div>
    </div>
  )
}

export default RecommendedHotels
