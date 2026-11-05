import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotels, deleteHotel } from '../store/hotelSlice';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import SearchFilters from '../components/SearchFliters';
import SuccessPopup from '../components/Popup';

const LIMIT = 5;

export default function HotelListPage() {
  const dispatch = useDispatch();
  const { items, total, loading, error } = useSelector((state) => state.hotels);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ title: '', minPrice: '', maxPrice: '' });
  const [toDelete, setToDelete] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(
      fetchHotels({
        ...filters,
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      })
    );
  }, [dispatch, page, filters]);

  const totalPages = Math.ceil(total / LIMIT);

  const handleApply = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    const hotel = toDelete;
    setToDelete(null);
    try {
      await dispatch(deleteHotel(hotel.id)).unwrap();
      setSuccessMsg(`"${hotel.title}" deleted successfully!`);
      if (items.length === 1 && page > 1) setPage(page - 1);
      else dispatch(fetchHotels({ ...filters, limit: LIMIT, offset: (page - 1) * LIMIT }));
    } catch {
      setSuccessMsg('Could not delete the hotel. Please try again.');
    }
  };

    return (
    <>
      <Helmet>
        <title>Hotels | Hotel Finder</title>
        <meta name="description" content="Browse, search and manage hotels by name and price range." />
      </Helmet>

      <h1 className="page-title">Find your next stay</h1>

      <SearchFilters initial={filters} onApply={handleApply} onReset={handleApply} />

      <p className="count"><strong>{total}</strong> stays found</p>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No hotels match your search.</p>}

      <div className="grid">
        {items.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} onDelete={setToDelete} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {toDelete && (
        <SuccessPopup
          message={`Delete "${toDelete.title}"?`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
      {successMsg && <SuccessPopup message={successMsg} onClose={() => setSuccessMsg('')} />}
    </>
  );
}