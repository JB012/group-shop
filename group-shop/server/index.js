const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const port = 5000;
const mysql = require("mysql");
const { verifyWebhook } = require('@clerk/express/webhooks');
const { clerkClient, clerkMiddleware, getAuth } =  require('@clerk/express')

require("dotenv").config({
    path: path.resolve(__dirname, ".env")
});

const users = require("./routes/users");

app.use("/users", users);
app.use(clerkMiddleware());

app.use(bodyParser.urlencoded({extended:false}));

app.post('/api/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    if (eventType === "user.deleted") {
        try {
            connection.query(`DELETE FROM favorites WHERE favoriteID=? OR userID=?`, [evt.data.id, evt.data.id]);
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