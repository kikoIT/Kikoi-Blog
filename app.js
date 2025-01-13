const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');


// express app
const app = express();

// connect to mongo db
const dbURI = 'mongodb+srv://lightblade254:PookieWookieB3ar@mernapp.gfk0q.mongodb.net/koi-blogs?retryWrites=true&w=majority&appName=MERNapp'
mongoose.connect(dbURI)
  .then(() => app.listen(3000))
  .catch((err) => console.log('err'));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(morgan('dev'));

// cookie routes
app.get('/set-cookies', (req, res) => {

  // res.setHeader('set-Cookie', 'newUser=true');

  res.cookie('newUser', false)
  res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

  res.send('you got the cookies');
});

app.get('/read-cookies', (req, res) => {

  const cookies = req.cookies;
  console.log(cookies);

  res.json(cookies);
});

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