require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const hotelRoutes = require('./routes/hotels');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/hotels', hotelRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'MulterError' || err.message?.startsWith('Only')) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be under 2MB' : err.message;
    return res.status(400).json({ errors: { image: message } });
  }
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));