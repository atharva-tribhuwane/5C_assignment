const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const { ConnectDatabase } = require("./Database/index");
const {getset, mutualfriends} = require("./Controllers/users");
// app.use(cors);
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Hello world How are you");
    // res.end();
});

app.get("/search/:username",getset);

app.get("/mutual/:username",mutualfriends);

ConnectDatabase().then(() => {
    app.listen(port, (err) => {
        if (err) {
            console.log("Error")
        }
        else {
            console.log("Server Started at:", port);
        }
    })
})