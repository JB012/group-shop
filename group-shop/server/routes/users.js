const express = require('express');
const mysql = require("mysql");
const router = express.Router();

router.post('/addFavorite', (req, res) => {
    const currentUser = req.body.userName;
    const userToAdd = req.body.userToAdd;

    const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
    });

    try {
        connection.query(`INSERT INTO favorites VALUES (?, ?)`, [currentUser, userToAdd]);
    }
    catch (err) {
        res.send(err);
    }

    return res.status(200).send("Added");
});

module.exports = router;