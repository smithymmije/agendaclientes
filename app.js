require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const flash = require('express-flash');
const session = require('express-session');
const connectDB = require('./server/config/db');

// Adicione no topo
const authRoutes = require('./server/routes/customerRoutes');
const authMiddleware = require('./server/middleware/authMiddleware');


const app = express();
const port = 5000 || process.env.PORT;

//connect to Database
connectDB();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))

//Static Files
app.use(express.static('public'));

// Express Session
app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      }
    })
  );

// Flash Messages
app.use(flash({ sessionKeyName: 'flashMessage' }));
  

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/customerRoutes'))

// Login
app.use('/', authRoutes);
app.use('/', authMiddleware, require('./server/routes/customerRoutes'));





// Handle 404
app.get('/{*splat}', (req, res) => {
    res.status(404).render('404');
});

// Express.js
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(200).end(); // Não precisa redirecionar, só encerrar
  });
});

app.listen(port, () => {
    console.log(`App listeing on port ${port}`)
  });
  

