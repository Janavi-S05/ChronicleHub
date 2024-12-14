require('dotenv').config();
const config = require("./config.json");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/", require("./routes/userRouter"));
app.use("/", require("./routes/blogRouter"));
app.use("/",require("./routes/imageRouter"));

app.use("/uploads", express.static(path.join(__dirname,"uploads")));
app.use("/assets",express.static(path.join(__dirname,"assets")));

app.listen(8000);
module.exports=app;