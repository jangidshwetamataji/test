const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); // Import cors
const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // or your phpMyAdmin user
  password: '', // your MySQL root password
  database: 'favorite_jokes_db', // your created database
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

// API to save a favorite joke to the DB
app.post('/api/favorites', (req, res) => {
  const { id, joke } = req.body;
  if (!id || !joke) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  const query = 'INSERT INTO favorites (id, joke) VALUES (?, ?)';
  db.query(query, [id, joke], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save joke' });
    }
    res.status(200).json({ message: 'Joke saved successfully' });
  });
});
// API to get all favorite jokes from the DB
app.get('/api/favorites', (req, res) => {
    const query = 'SELECT * FROM favorites';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch favorites' });
      }
      res.status(200).json(results);
    });
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
