const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

require("./db");

const app = express();

app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running!");
})

