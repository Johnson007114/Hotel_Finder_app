const fs = require('fs');

const validateHotel = ({ imageRequired }) => (req, res, next) => {
  const { title, description, latitude, longitude, price } = req.body;
  const errors = {};

  if (!title || !title.trim()) errors.title = 'Title is required';
  else if (title.trim().length > 150) errors.title = 'Title must be under 150 characters';

  if (!description || !description.trim()) errors.description = 'Description is required';
  else if (description.trim().length < 10) errors.description = 'Description must be at least 10 characters';

  const lat = Number(latitude);
  if (latitude === undefined || latitude === '' || Number.isNaN(lat) || lat < -90 || lat > 90)
    errors.latitude = 'Latitude must be a number between -90 and 90';

  const lng = Number(longitude);
  if (longitude === undefined || longitude === '' || Number.isNaN(lng) || lng < -180 || lng > 180)
    errors.longitude = 'Longitude must be a number between -180 and 180';

  const p = Number(price);
  if (price === undefined || price === '' || Number.isNaN(p) || p < 0)
    errors.price = 'Price must be a positive number';

  if (imageRequired && !req.file) errors.image = 'Image is required';

  if (Object.keys(errors).length > 0) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = validateHotel;