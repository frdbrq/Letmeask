import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NewRoom } from './pages/NewRoom';
import { Home } from './pages/Home';
import { Room } from './pages/Room'

import { AuthContextProvider } from './contexts/AuthContext'
import { AdminRoom } from './pages/AdminRoom';

function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms/new" element={<NewRoom />} />
            <Route path="/rooms/:id" element={<Room />} />
            <Route path="/admin/rooms/:id" element={<AdminRoom />} />  

          </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
