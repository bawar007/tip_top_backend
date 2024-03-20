const express = require("express");
const UserController = require("../controllers/UserController.js");

const app = express();
app.use(express.json());

// Port, na którym serwer będzie nasłuchiwał
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});

const router = express.Router();

router.get("/user", UserController.getUser);
router.post("/userCreate", UserController.createUser);
router.post("/login", UserController.heckLogin);
router.post("/marker", UserController.createMarker);

module.exports = router;
