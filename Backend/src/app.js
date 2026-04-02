const express  = require("express");
const authRoutes = require("../src/Routes/auth.routes")
const cookieparser = require("cookie-parser");
const morgan = require("morgan")

const app  = express();
app.use(express.json());
app.use(cookieparser());
app.use(morgan("dev"));

app.use("/api/auth",authRoutes);


module.exports = app;
