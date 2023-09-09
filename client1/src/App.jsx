
import { Route, Routes } from 'react-router'
import './App.css'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Header from './Header'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios';
import ProfilePage from "./pages/ProfilePage";
import { UserContextProvider } from './UserContext'
import PlacesPage from './pages/Placespage'
import PlacesFormPage from './pages/PlacesFormPage'
import Placepage from './pages/PlacePage'
import BookingsPage from './pages/BookingsPage'
import BookingPage from './pages/BookingPage'


axios.defaults.baseURL='http://127.0.0.1:4000';
axios.defaults.withCredentials=true;
function App() {
  return (
   <UserContextProvider> 
    <Routes>
        <Route path="/" element={<Layout/>} >
          <Route index element={<IndexPage/>}/>
         <Route path="/login" element={<LoginPage/>}/>
         <Route path="/register" element={<RegisterPage/>}/>
         <Route path="/account/" element={<ProfilePage />} />
         <Route path="/account/places" element={<PlacesPage />} />
         <Route path="/account/places/new" element={<PlacesFormPage />} />
         <Route path="/account/places/:id" element={<PlacesFormPage />} />
         <Route path="/place/:id" element={<Placepage />} />
         <Route path="/account/bookings" element={<BookingsPage />} />
         <Route path="/account/bookings/:id" element={<BookingPage />} />
          
         </Route>
    </Routes>
  </UserContextProvider> 
    
  )
}

export default App
