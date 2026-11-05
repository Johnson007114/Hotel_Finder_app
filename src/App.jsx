import { Routes, Route, Link } from 'react-router-dom';
import HotelListPage from './pages/HotelListPage';
import HotelDetailPage from './pages/HotelDetailPage';
import HotelFormPage from './pages/HotelFormPage';

export default function App() {
  return (
    <>
      <header className="navbar">
        <Link to="/" className="brand">
          <span className="logo">⌂</span> stayfinder
        </Link>
        <Link to="/hotels/new" className="btn btn-primary btn-pill">+ Add Hotel</Link>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<HotelListPage />} />
          <Route path="/hotels/new" element={<HotelFormPage />} />
          <Route path="/hotels/:id/edit" element={<HotelFormPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </>
  );
}