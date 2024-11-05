const express = require("express");
const port = 3000
const blogRoutes = require('./routes/blogRoutes');
const app = express();
import pg from 'pg';

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'BlogDB',
  //password: not including personal password,
  port: 4312
});

// Parse URL encoded bodies
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));  

app.use(blogRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

db.connect();

app.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});

// Handle signup form submission
app.post("/signup", async (req, res) => {
  const { password, name } = req.body;

  const userPassword = String(password);
  const userName = String(name);

  const result = await db.query('SELECT * FROM users WHERE name = $1', [name]);

  // check for user already taken
  if (result.rowCount > 0) {
      // Username is already taken
      return res.render("signup", { error: 'Username is already taken. Please choose a different one.' });
  }

  // if client info is fine send to datbase 
  await db.query('INSERT INTO users (password, name) VALUES ($1, $2)', [userPassword, userName]);

  // redirect to signin page to use new login we created 
  res.redirect('/signin');
});

// Renders the signin page
app.get("/signin", (req, res) => {
  res.render("signin", { error: null });
});

// Handle signin form submission
app.post("/signin", async (req, res) => {
  const { name, password } = req.body;

  const userPassword = String(password);
  const userName = String(name);

  const result = await db.query('SELECT * FROM users WHERE name = $1 AND password = $2', [userName, userPassword]);

  // check for invalid log in
  if (result.rows.length === 0) {
      return res.render("signin", { error: 'Invalid User ID or Password. Please try again.' });
  }

  // Successful login
  currentUser = {
      id: result.rows[0].user_id,
      name: result.rows[0].name,
  };

  // successful login redirect to main page
  res.redirect("/");
});

// http://localhost:3000