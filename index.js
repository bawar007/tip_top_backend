const express = require("express");
const cors = require("cors");
require("dotenv/config");

const PORT = 5000;
const UserRoute = require("./routes/UserRoute.js");

const app = express();

app.use(express.static("public"));

app.use(cors());
app.use(express.json());
app.use(UserRoute);

app.listen(PORT, () => {
  console.log("Server up and running..." + PORT);
});
