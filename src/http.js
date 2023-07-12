const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.status(200);
    res.send("OK");
})

app.listen(process.env.PORT || port, () => {
    console.log("Listening on " + process.env.PORT || port);
})