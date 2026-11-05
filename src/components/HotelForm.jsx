import { useState } from 'react';

const EMPTY = { title: '', description: '', latitude: '', longitude: '', price: '' }

const validate = (values, imageFile, hasExistingImage) => {
    const errors = {};
    if (!values.title.trim()) errors.title = 'Title is required';
    else if (values.title.length > 150) errors.title = 'Title is too long';

    if (!values.description.trim()) errors.description = 'Description is required';
    else if (values.description.trim().length > 200) errors.description = 'Description is too long';

    const lat = Number(values.latitude);
    
    if (!values.latitude === '' || Number.isNaN(lat) || lat < -90 || lat > 90)
         errors.latitude = 'Latitude is required';

    const lng = Number(values.longitude);
    if (!values.longitude === '' || Number.isNaN(lng) || lng < -180 || lng > 180)
        errors.longitude = 'Longitude is required';

    const price = Number(values.price);
    if (!values.price === '' || Number.isNaN(price) || price < 0)
        errors.price = 'Enter a Valid Price';
    
    if (!hasExistingImage && !imageFile) errors.image = 'Please select an image';
    return errors;
};

export default function HotelForm({ initialValues, onSubmit, submitLabel = 'Save', submitting, serverErrors = {} }) {
    const [values, setValues] = useState(initialValues ?
        {
            title: initialValues.title,
            description: initialValues.description,
            latitude: initialValues.latitude,
            longitude: initialValues.longitude,
            price: initialValues.price,
        }
        : EMPTY
    );
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(initialValues?.image_path || '');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const {name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value}));
        setErrors((prev) => ({ ...prev, [name]: undefined}));
    }

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return setErrors((p) => ({...p, image: 'Only image files allowed'}))
        if (file.size > 2 * 1024 * 1024) return setErrors((p) => ({ ...p, image: 'Image must be under 2MB'}))
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
        setErrors((p) => ({ ...p, image: undefined }))
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const found = validate(values, imageFile, Boolean(initialValues?.image_path));
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        const formData = new FormData();
        Object.entries(values).forEach(([key, val]) => formData.append(key, val))
        if (imageFile) formData.append('image', imageFile);
        onSubmit(formData);
    };

    const error = (field) => errors[field] || serverErrors[field];

    return (
        <form className='card form' onSubmit={handleSubmit} noValidate>
            <div className='field'>
                <label htmlFor="image">Image</label>
                <input id="image" type="file" accept="image/*" onChange={handleImage} />
                {preview && <img className='preview' src={preview} alt="Selected hotel preview" />}
                {error('image') && <span className='error'>{error('image')}</span>}
            </div>

            <div className="field">
        <label htmlFor="title">Title</label>
        <textarea id="title" name="title" value={values.title} onChange={handleChange} placeholder="Hotel Name"/>
        {error('title') && <span className="error">{error('title')}</span>}
      </div>
            
            <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="4" value={values.description} onChange={handleChange} />
        {error('description') && <span className="error">{error('description')}</span>}
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="latitude">Latitude</label>
          <input id="latitude" name="latitude" type="number" step="any" value={values.latitude} onChange={handleChange} placeholder="13.0827" />
          {error('latitude') && <span className="error">{error('latitude')}</span>}
        </div>
        <div className="field">
          <label htmlFor="longitude">Longitude</label>
          <input id="longitude" name="longitude" type="number" step="any" value={values.longitude} onChange={handleChange} placeholder="80.2707" />
          {error('longitude') && <span className="error">{error('longitude')}</span>}
        </div>
      </div>
      <div className="field">
        <label htmlFor="price">Price (₹)</label>
        <input id="price" name="price" type="number" min="0" step="0.01" value={values.price} onChange={handleChange} />
        {error('price') && <span className="error">{error('price')}</span>}
      </div>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>

        </form>
    );
}
    
