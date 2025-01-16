const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');


// express app
const app = express();

// connect to mongo db
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT))
  .catch((err) => console.log('err'));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.redirect('/blogs')
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

//auth routes
app.use(authRoutes);

// blog routes 
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});