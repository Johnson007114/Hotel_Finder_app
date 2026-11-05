import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { createHotel, updateHotel, fetchHotelById, clearCurrent } from '../store/hotelSlice';
import HotelForm from '../components/HotelForm';
import SuccessPopup from '../components/Popup';

export default function HotelFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((s) => s.hotels);

  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (isEdit) dispatch(fetchHotelById(id));
    else dispatch(clearCurrent());
  }, [dispatch, id, isEdit]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setServerErrors({});
    try {
      if (isEdit) await dispatch(updateHotel({ id, formData })).unwrap();
      else await dispatch(createHotel(formData)).unwrap();
      setDone(true);
    } 
    catch (error) {
      setServerErrors(error.errors || { title: error.message });
    } 
    finally {
      setSubmitting(false);
    }
  };

  if (isEdit && (loading || !current)) return <p>Loading...</p>;

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Hotel' : 'Add Hotel'} | Hotel Finder</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h2>{isEdit ? 'Edit Hotel' : 'Add New Hotel'}</h2>
      <HotelForm
        key={id || 'new'}
        initialValues={isEdit ? current : null}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? 'Update Hotel' : 'Create Hotel'}
        submitting={submitting}
        serverErrors={serverErrors}
      />

      {done && (
        <SuccessPopup
          message={isEdit ? 'Hotel updated successfully!' : 'Hotel created successfully!'}
          onClose={() => navigate('/')}
        />
      )}
    </>
  );
}