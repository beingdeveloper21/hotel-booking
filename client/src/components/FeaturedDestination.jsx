import React from 'react'
import {roomsDummyData} from '../assets/assets'
import Title from './Title'
import HotelCard from './HotelCard'
import {useNavigate} from 'react-router-dom'
const FeaturedDestination = () => {
  const navigate=useNavigate()
  return (
    <div className='flex flex-col items-center px-16 md:px-26 lg:px-24 bg-slate-50 py-20'>
      <Title title='Featured Destination' subTitle='Discover our handpicked selection of exceptional properties around the world,offering unparalleled luxury and unforgettable experiences.'/>
       <div className='flex flex-nowrap overflow-x-auto   gap-8 w-full mt-20 no-scrollbar'>
        {roomsDummyData.slice(0,4).map((room,index)=>(
            <HotelCard key={room._id} room={room} index={index}/>
        ))}
      </div>
      <button onClick={()=>{navigate('/rooms');scrollTo(0,0)}} className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
        View All Destinations
      </button>
    </div>
  )
}

export default FeaturedDestination
