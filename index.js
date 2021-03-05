const express = require("express");
const app = express();

var server = app.listen(4000 , () => {
    console.log("Nader is here");
})

app.use(express.static("public"));
