const express = require('express');
const mysql = require("mysql");
const { pool } = require("../db");
const router = express.Router();
const { clerkClient, clerkMiddleware, getAuth } =  require('@clerk/express')
//TODO: Clear Clerk users, make users, display all users in People search section,
// add user to favorite, display favorite 

router.use(clerkMiddleware());

router.get('/', async (req, res) => {
    try {
        pool.query('SELECT userID FROM users', async (err, results, fields) => {
            const userIDJSONs = Object.values(JSON.parse(JSON.stringify(results)));
            const users = [];

            for (const json of userIDJSONs) {
                try {
                    const user = await clerkClient.users.getUser(json["userID"]);
                    users.push({fullName: user.fullName, id: user.id, userName: user.username});
                }
                catch (err) {
                    console.log(err);
                }
            }

            res.send(users);
        });
    }
    catch (err) {
        res.send(err);
    }
});

router.get('/:userID/favorites', (req, res) => {
    const userID = req.params["userID"];

    try {
        pool.query('SELECT favoriteID FROM favorites WHERE userID=?', [userID], (err, results, fields) => {
            const favorites = Object.values(JSON.parse(JSON.stringify(results)));

            return res.send(favorites);
        });
    }
    catch(err) {
        console.log(err);
        return res.send({});
    }
 
})

router.post('/addFavorite', (req, res) => {
    const currentUser = req.body.userName;
    const userToAdd = req.body.userToAdd;
    try {
        pool.query(`INSERT INTO favorites VALUES (?, ?)`, [currentUser, userToAdd]);
    }
    catch (err) {
        res.send(P);
    }

    return res.send("Added");
});

module.exports = router;