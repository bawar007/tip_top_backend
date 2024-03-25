const express = require("express");
const UserController = require("../controllers/UserController.js");

// Port, na którym serwer będzie nasłuchiwał

const router = express.Router();

router.get("/user", UserController.getUser);
router.post("/userCreate", UserController.createUser);
router.post("/login", UserController.heckLogin);
router.post("/marker", UserController.createMarker);
router.get("/reports", UserController.getMarkersInReports);

module.exports = router;
