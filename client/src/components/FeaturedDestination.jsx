// import React from 'react'
// import Title from './Title'
// import HotelCard from './HotelCard'
// import {useNavigate} from 'react-router-dom'
// import { useAppContext } from '../context/AppContext'
// const FeaturedDestination = () => {
//   const {rooms,navigate}=useAppContext();
//   return rooms.length>0 && (
  
//     <div className='flex flex-col items-center px-16 md:px-26 lg:px-24 bg-slate-50 py-20'>
//       <Title title='Featured Destination' subTitle='Discover our handpicked selection of exceptional properties around the world,offering unparalleled luxury and unforgettable experiences.'/>
//        <div className='flex flex-nowrap overflow-x-auto   gap-8 w-full mt-20 no-scrollbar'>
//         {rooms.slice(0,4).map((room,index)=>(
//             <HotelCard key={room._id} room={room} index={index}/>
//         ))}
//       </div>
//       <button onClick={()=>{navigate('/rooms');scrollTo(0,0)}} className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
//         View All Destinations
//       </button>
//     </div>
//   )
// }

// export default FeaturedDestination
import React from 'react'
import Title from './Title'
import HotelCard from './HotelCard'
import { useAppContext } from '../context/AppContext'

const FeaturedDestination = () => {
  const { rooms, navigate } = useAppContext();

  return (
    rooms.length > 0 && (
      <div className="hidden sm:flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 bg-slate-50 py-12 sm:py-16 lg:py-20">
        
        {/* Title */}
        <div className="max-w-3xl text-center">
          <Title
            title="Featured Destination"
            subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
          />
        </div>

        {/* Responsive Grid */}
        <div className="mt-10 sm:mt-16 w-full max-w-screen-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {rooms.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <button
          onClick={() => {
            navigate('/rooms');
            scrollTo(0, 0);
          }}
          className="mt-10 sm:mt-16 px-4 sm:px-6 py-2 text-sm sm:text-base font-medium border border-gray-300 rounded bg-white hover:bg-gray-100 transition-all"
        >
          View All Destinations
        </button>
      </div>
    )
  );
};

export default FeaturedDestination;
