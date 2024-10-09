const path = require("path");
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const port = 3000;

app.use(express.json()); // to read incoming json stuff
const db = require("./config/database");
const res = require("express/lib/response");
const Searches = require("./js/search");
const userRoute = require("./routes/users");
const reviewsRoute = require("./routes/reviews");
const searchRoute = require("./routes/search");
const session = require('express-session');
const flash = require('req-flash');
const cookieParser = require('cookie-parser');


app.use(cookieParser());

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));

app.use(session({
  cookie: { maxAge: 1200000 },  //increased to make sure session doesnt expire in 1 minute
  secret: 'woot',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.get('/navbar', (req, res) => {
  res.sendFile(path.join(__dirname, './html/navbar.html'));
});

app.get('/dashboardicon', (req, res) => {
  res.sendFile(path.join(__dirname, './html/dashboard_icon.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, './html/dashboard.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './html/login.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './html/index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, './html/about.html'));
});

app.get('/about/Eric', (req, res) => {
  res.sendFile(path.join(__dirname, './html/aboutEric.html'));
});

app.get('/about/Lei', (req, res) => {
  res.sendFile(path.join(__dirname, './html/aboutLei.html'));
});

app.get('/about/Elliott', (req, res) => {
  res.sendFile(path.join(__dirname, './html/elliott.html'));
});

app.get('/about/Alex', (req, res) => {
  res.sendFile(path.join(__dirname, './html/aboutAlex.html'));
});

app.get('/about/Mila', (req, res) => {
  res.sendFile(path.join(__dirname, './html/mila.html'));
});

app.get('/about/Oscar', (req, res) => {
  res.sendFile(path.join(__dirname, './html/oscarg.html'));
});

app.get('/about/Riel', (req, res) => {
  res.sendFile(path.join(__dirname, './html/riel.html'));
});

app.get('*.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, req.url));
});

app.get('*.JPG', (req, res) => {
  res.sendFile(path.join(__dirname, req.url));
});

app.get('*.css', (req, res) => {
  res.sendFile(path.join(__dirname, req.url));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/script.js'));
});

app.get('/searchScript.js', (req, res) => {
  res.sendFile(path.join(__dirname, './js/searchScript.js'));
});

app.use(express.static(__dirname + './js/searchScript.js'));

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, './html/userReg.html'));
});

app.post('/universities', async (req, res) => {
  const { searchTerm, sortSelection } = req.body;
  const results = await Searches.universityCoords(searchTerm, sortSelection);
  res.json(results);
});

app.use('/search', searchRoute);

app.use('/readReviews', reviewsRoute);

app.use('/users', userRoute);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
