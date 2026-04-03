const express  = require("express");
const authRoutes = require("../src/Routes/auth.routes")
const cookieparser = require("cookie-parser");
const morgan = require("morgan");
const userRoutes = require("../src/Routes/user.routes");
const recordRoutes = require("../src/Routes/records.routes");
const dashBoardRoutes = require("../src/Routes/dashboard.routes")
const app  = express();
app.use(express.json());
app.use(cookieparser());
app.use(morgan("dev"));

app.use("/api/auth",authRoutes);;
app.use("/api/users/",userRoutes);
app.use("/api/records",recordRoutes);
app.use("/api/dashboard",dashBoardRoutes);



module.exports = app;
