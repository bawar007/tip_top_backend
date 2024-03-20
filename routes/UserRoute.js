const express = require("express");
const UserController = require("../controllers/UserController.js");

const getUser = UserController.getUser;
const createUser = UserController.createUser;

const app = express();
app.use(express.json());

// Port, na którym serwer będzie nasłuchiwał
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});

const router = express.Router();

router.get("/user", getUser);
router.post("/user", createUser);

module.exports = router;
