const express = require('express');
const mysql = require("mysql");
const { pool } = require("../db");
const router = express.Router();
const { clerkClient, clerkMiddleware, getAuth } =  require('@clerk/express')
const bodyParser = require("body-parser");
//TODO: Clear Clerk users, make users, display all users in People search section,
// add user to favorite, display favorite 

router.use(clerkMiddleware());

router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json())

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
        pool.query('SELECT favoriteID FROM favorites WHERE userID=?', [userID], async (err, results, fields) => {
            const favoriteIDJSONs = Object.values(JSON.parse(JSON.stringify(results)));
            const favorites = [];

            for (const favoriteIDJSON of favoriteIDJSONs) {
                const user = await clerkClient.users.getUser(favoriteIDJSON["favoriteID"]);
                favorites.push({fullName: user.fullName, id: user.id, userName: user.username});
            }

            return res.send(favorites);
        });
    }
    catch(err) {
        console.log(err);
        return res.send([]);
    }
 
})

router.post('/addFavorite', (req, res) => {
    const currentUserID = req.body.currentUserID;
    const favoriteID = req.body.favoriteID;
    try {
        pool.query(`INSERT INTO favorites VALUES (?, ?)`, [currentUserID, favoriteID]);
        
        console.log('Added favorites');
    }
    catch (err) {
        res.send(err);
    }
    return res.send("Added");
});

router.post('/removeFavorite', (req, res) => {
    const currentUserID = req.body.currentUserID;
    const favoriteID = req.body.favoriteID;
    try {
        pool.query(`DELETE FROM favorites WHERE userID=? AND favoriteID=?`, [currentUserID, favoriteID]);
        console.log('removed from favorites');
    }
    catch (err) {
        res.send(err);
    }
    return res.send("Removed");
});

module.exports = router;