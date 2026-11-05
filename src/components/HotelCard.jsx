import { Link } from 'react-router-dom';

const snippet = (text, max = 110) => (text.length > max ? text.slice(0, max).trim() + '…' : text);

export default function HotelCard({ hotel, onDelete }) {
  return (
    <article className="hotel-card">
      <Link to={`/hotels/${hotel.id}`} className="hotel-img-wrap">
        <img src={hotel.image_path} alt={`${hotel.title} hotel`} loading="lazy" />
      </Link>

      <div className="card-actions">
        <Link to={`/hotels/${hotel.id}/edit`} className="icon-btn" title="Edit" aria-label="Edit hotel">✏️</Link>
        <button className="icon-btn" title="Delete" aria-label="Delete hotel" onClick={() => onDelete(hotel)}>🗑️</button>
      </div>

      <div className="hotel-info">
        <Link to={`/hotels/${hotel.id}`}><h3>{hotel.title}</h3></Link>
        <p className="hotel-desc">{snippet(hotel.description)}</p>
        <div className="hotel-price">
          <strong>₹{Number(hotel.price).toLocaleString('en-IN')}</strong> <span className="muted">night</span>
        </div>
        <Link to={`/hotels/${hotel.id}`} className="view-link">View details</Link>
      </div>
    </article>
  );
}