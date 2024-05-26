const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: '192.168.221.206',
    user: 'dynamo2k1',
    password: '1590',
    database: 'siem_solution'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

// Route to fetch data from any table
app.get('/api/:table', (req, res) => {
    const table = req.params.table;
    const query = `SELECT * FROM ??`;
    db.query(query, [table], (err, results) => {
        if (err) {
            console.error('Error fetching data from table:', table, err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// Specific route to fetch data from the usage_data table
app.get('/api/usage_data', (req, res) => {
    const query = `SELECT * FROM usage_data`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from usage_data table:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
