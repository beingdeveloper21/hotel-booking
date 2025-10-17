
import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import About from './pages/About'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import HotelReg from './components/HotelReg'
import Layout from './pages/hotelOwner/Layout'
import AddRoom from './pages/hotelOwner/AddRoom'
import ListRoom from './pages/hotelOwner/ListRoom'
import Dashboard from './pages/hotelOwner/Dashboard'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import Loader from './components/Loader'

const App = () => {
  const { showHotelReg } = useAppContext();

  return (
    <div>
      <Toaster />
      {/* Always show Navbar */}
      <Navbar />

      {/* Hotel registration modal */}
      {showHotelReg && <HotelReg />}

      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/loader/my-bookings' element={<MyBookings />} />

          <Route path='/loader/:nextUrl' element={<Loader />} />

          {/* Owner Layout */}
          <Route path='/owner' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='add-room' element={<AddRoom />} />
            <Route path='list-room' element={<ListRoom />} />
          </Route>
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App
