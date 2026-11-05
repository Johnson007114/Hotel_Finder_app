import { useState } from 'react';

export default function SearchFilters({ initial, onApply, onReset }) {
  const [form, setForm] = useState(initial);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(form);
  };

  const handleReset = () => {
    const empty = { title: '', minPrice: '', maxPrice: '' };
    setForm(empty);
    onReset(empty);
  };

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <div className="sb-field">
        <label htmlFor="f-title">Hotel</label>
        <input id="f-title" name="title" value={form.title} onChange={handleChange} placeholder="Search by name" />
      </div>
      <div className="sb-field">
        <label htmlFor="f-min">Min price</label>
        <input id="f-min" name="minPrice" type="number" min="0" value={form.minPrice} onChange={handleChange} placeholder="₹ 0" />
      </div>
      <div className="sb-field">
        <label htmlFor="f-max">Max price</label>
        <input id="f-max" name="maxPrice" type="number" min="0" value={form.maxPrice} onChange={handleChange} placeholder="₹ Any" />
      </div>
      <button className="sb-search" type="submit"> Search</button>
      <button className="sb-reset text-lime-400" type="button" onClick={handleReset}> Reset</button>
    </form>
  );
}