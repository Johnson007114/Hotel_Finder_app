import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotelById } from '../store/hotelSlice';

const distanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function HotelDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: hotel, loading, error } = useSelector((s) => s.hotels);
  const [distance, setDistance] = useState(null);
  const [geoMsg, setGeoMsg] = useState('');

  useEffect(() => {
    dispatch(fetchHotelById(id));
  }, [dispatch, id]);

  const findDistance = () => {
    setDistance(null);
    if (!navigator.geolocation) {
      return setGeoMsg('This browser does not support location.');
    }
    setGeoMsg('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = distanceKm(
          pos.coords.latitude,
          pos.coords.longitude,
          Number(hotel.latitude),
          Number(hotel.longitude)
        );
        setDistance(km.toFixed(1));
        setGeoMsg('');
      },
      (error) => {
        if (error.code === 1) setGeoMsg('Location permission denied. Allow location in the browser site settings.');
        else if (error.code === 2) setGeoMsg('Location unavailable. Turn on Windows Location services and Wi-Fi.');
        else setGeoMsg('Location request timed out. Try again.');
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
    );
  };

  if (loading) return <p>Loaded...</p>;
  if (error || !hotel) return <p className="error">{error || 'Hotel not found'}</p>;

  const lat = Number(hotel.latitude);
  const lng = Number(hotel.longitude);
  const d = 0.01;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
  const googleLink = `https://www.google.com/maps?q=${lat},${lng}`;

    return (
    <>
      <Helmet>
        <title>{hotel.title} | Hotel Finder</title>
        <meta name="description" content={hotel.description.slice(0, 150)} />
        <meta property="og:title" content={hotel.title} />
        <meta property="og:image" content={hotel.image_path} />
      </Helmet>

      <Link to="/" className="back">← Back </Link>

      <h1 className="detail-title">{hotel.title}</h1>
      <p className="muted">📍 {lat}, {lng}</p>

      <img className="detail-hero" src={hotel.image_path} alt={`${hotel.title} hotel`} />

      <div className="detail-grid">
        <div>
          <h2>About this place</h2>
          <p className="detail-desc">{hotel.description}</p>

          <hr className="divider" />

          <h2>Where you'll be</h2>
          <iframe className="map" title={`Map showing location of ${hotel.title}`} src={mapSrc} loading="lazy" />
          <p><a href={googleLink} target="_blank" rel="noreferrer" className="view-link">Open in Google Maps</a></p>
        </div>

        <aside className="booking-card">
          <div className="price">
            ₹{Number(hotel.price).toLocaleString('en-IN')} <span className="muted"> /night</span>
          </div>
          <button className="btn btn-primary btn-block" onClick={findDistance}>How far from me?</button>
          {distance && <p className="distance-result"><strong>{distance} km</strong> from your location</p>}
          {geoMsg && <p className="muted">{geoMsg}</p>}
          <Link to={`/hotels/${hotel.id}/edit`} className="btn btn-outline btn-block">Edit Hotel</Link>
        </aside>
      </div>
    </>
  );
}