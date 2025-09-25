import React, { useState, useMemo, useEffect } from 'react';
import { facilityIcons, assets } from '../assets/assets';
import { useSearchParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
    />
    <span className='font-light select-none'>{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
    />
    <span className='font-light select-none'>{label}</span>
  </label>
);

const AllRooms = () => {
  const [openFilters, setOpenFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { rooms, navigate, currency, fetchRooms } = useAppContext(); // ✅ Added fetchRooms

  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });
  const [selectedSort, setSelectedSort] = useState('');

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = ['0 to 500', '500 to 1000', '1000 to 2000', '2000 to 3000'];
  const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (checked) updated[type].push(value);
      else updated[type] = updated[type].filter(item => item !== value);
      return updated;
    });
  };

  const handleSortChange = (sortOption) => setSelectedSort(sortOption);

  const matchesRoomType = (room) =>
    selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room?.roomType);

  const matchesPriceRange = (room) =>
    selectedFilters.priceRange.length === 0 ||
    selectedFilters.priceRange.some((range) => {
      const [min, max] = range.split('to ').map(Number);
      return room?.pricePerNight >= min && room?.pricePerNight <= max;
    });

  const sortRooms = (a, b) => {
    if (selectedSort === 'Price Low to High') return a.pricePerNight - b.pricePerNight;
    if (selectedSort === 'Price High to Low') return b.pricePerNight - a.pricePerNight;
    if (selectedSort === 'Newest First') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  };

  const filterDestination = (room) => {
    const destination = searchParams.get('destination');
    if (!destination) return true;
    return room?.hotel?.city?.toLowerCase().includes(destination.toLowerCase());
  };

  // ✅ Update filteredRooms dynamically
  const filteredRooms = useMemo(() => {
    return rooms
      .filter(room => matchesRoomType(room) && matchesPriceRange(room) && filterDestination(room))
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams]);

  // ✅ Refetch rooms when component mounts to ensure latest data
  useEffect(() => {
    fetchRooms();
  }, []); 

  const clearFilters = () => {
    setSelectedFilters({ roomType: [], priceRange: [] });
    setSelectedSort('');
    setSearchParams({});
  };

  return (
    <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div className='flex flex-col items-start text-left'>
        <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
        <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
          Take advantage of our limited-time offers and special packages to enhance your stay.
        </p>
      </div>

      <div className='flex flex-col lg:flex-row justify-between gap-8 mt-10'>
        {/* Left: Room Cards */}
        <div className='flex flex-col gap-10 w-full lg:w-3/4'>
          {filteredRooms.map(room => (
            <div
              key={room?._id}
              className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'
            >
              <img
                src={room?.images?.[0] || assets.defaultRoomImg}
                alt="hotel-img"
                title="View Room Details"
                className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
                onClick={() => { navigate(`/rooms/${room?._id}`); scrollTo(0,0); }}
              />
              <div className='md:w-1/2 flex flex-col gap-2'>
                <p className='text-gray-500'>{room?.hotel?.city || "Unknown City"}</p>
                <p className='cursor-pointer hover:underline'
                   onClick={() => { navigate(`/rooms/${room?._id}`); scrollTo(0,0); }}
                >
                  {room?.hotel?.name || "Unnamed Hotel"}
                </p>
                <div className='flex items-center'>
                  <StarRating />
                  <p className='ml-2'>200+ Reviews</p>
                </div>
                <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                  <img src={assets.locationIcon} alt="location-icon" />
                  <span>{room?.hotel?.address || "Address not available"}</span>
                </div>
                <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                  {room?.amenities?.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                      <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                      <p className='text-xs'>{item}</p>
                    </div>
                  ))}
                </div>
                <p className='text-xl font-medium text-gray-700'>
                  {currency} {room?.pricePerNight || "N/A"} /night
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Filters */}
        <div className='bg-white w-full lg:w-80 border border-gray-300 text-gray-600 lg:self-start max-lg:mb-8 min-lg:mt-16'>
          <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && 'border-b'}`}>
            <p className='text-base font-medium text-gray-800'>FILTERS</p>
            <div className='text-xs cursor-pointer'>
              <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
                {openFilters ? 'HIDE' : 'SHOW'}
              </span>
              <span onClick={clearFilters} className='hidden lg:block'>CLEAR</span>
            </div>
          </div>

          {/* Filter Options */}
          <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
            <div className='px-5 pt-5'>
              <p className='font-medium text-gray-800 pb-2'>Popular Filters</p>
              {roomTypes.map((roomType, index) => (
                <CheckBox
                  key={index}
                  label={roomType}
                  selected={selectedFilters.roomType.includes(roomType)}
                  onChange={(checked) => handleFilterChange(checked, roomType, 'roomType')}
                />
              ))}
            </div>
            <div className='px-5 pt-5'>
              <p className='font-medium text-gray-800 pb-2'>Price Range</p>
              {priceRanges.map((range, index) => (
                <CheckBox
                  key={index}
                  label={`${currency} ${range}`}
                  selected={selectedFilters.priceRange.includes(range)}
                  onChange={(checked) => handleFilterChange(checked, range, 'priceRange')}
                />
              ))}
            </div>
            <div className='px-5 pt-5 pb-7'>
              <p className='font-medium text-gray-800 pb-2'>Sort By</p>
              {sortOptions.map((option, index) => (
                <RadioButton
                  key={index}
                  label={option}
                  selected={selectedSort === option}
                  onChange={() => handleSortChange(option)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;

