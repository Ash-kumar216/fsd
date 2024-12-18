const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection(`mysql://root:WuyBPxVLMzhUmEZQwgwBaEEvZfGSVmfZ@autorack.proxy.rlwy.net:33446/railway`);

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL Database:', err.message);
        throw err;
    }
    console.log('Connected to MySQL Database!');
});

app.post('/add-employee', (req, res) => {
    const { name, employeeId, email, phone, department, dateOfJoining, role } = req.body;

    if (!name || !employeeId || !email || !phone || !department || !dateOfJoining || !role) {
        return res.status(400).send('All fields are required.');
    }

    const checkQuery = 'SELECT * FROM Employees WHERE employeeId = ? OR email = ?';
    db.query(checkQuery, [employeeId, email], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).send('Server error.');
        }

        if (results.length > 0) {
            return res.status(400).send('Employee ID or Email already exists.');
        }

        const insertQuery = 'INSERT INTO  Employees (name, employeeId, email, phone, department, dateOfJoining, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [name, employeeId, email, phone, department, dateOfJoining, role], (err, result) => {
            if (err){
                console.error('Error executing query:', err.message);
                return res.status(500).send('Error adding employee.');
            }
            res.send('Employee added successfully!');
        });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
