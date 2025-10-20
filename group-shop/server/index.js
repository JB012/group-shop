const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const port = 5000;
const { pool } = require("./db");
const { verifyWebhook } = require('@clerk/express/webhooks');
const { clerkClient, clerkMiddleware, getAuth } =  require('@clerk/express')
const users = require("./routes/users");
const cors = require('cors');

app.use("/users", users);
app.use(clerkMiddleware());
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

app.post('/api/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type

    if (eventType === "user.created") {
        try {
          pool.query('INSERT INTO users VALUES (?)', [evt.data.id], (err, results, fields) => {
            console.log(results);
          });
        }
        catch (err) {
            console.error('Error verifying webhook:', err)
            return res.status(400).send('Error verifying webhook')
        }
    }

    else if (eventType === "user.deleted") {
        try {
            pool.getConnection((err, connection) => {
              connection.query(`DELETE FROM favorites WHERE favoriteID=? OR userID=?`, [evt.data.id, evt.data.id]);
              connection.query(`DELETE FROM users WHERE userID=?`, [evt.data.id]);

              connection.release();
            });
        }
        catch(err) {
            console.error('Error verifying webhook:', err)
            return res.status(400).send('Error verifying webhook')
        }
    }

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    return res.send('Webhook received')
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return res.status(400).send('Error verifying webhook')
  }
})

app.listen(port, () => `Listening on http://localhost:${port}`);